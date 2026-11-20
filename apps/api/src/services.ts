import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "./prisma.service";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

export function consumeRateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function resetRateLimits(): void {
  hits.clear();
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async write(actor: string, action: string, target?: string): Promise<void> {
    await this.prisma.auditLog.create({ data: { actor, action, target: target ?? null } });
  }
}

@Injectable()
export class MailService {
  async send(to: string, subject: string, text: string): Promise<"sent" | "queued"> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (apiKey && from) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, text }),
      });
      if (!response.ok) return this.queue(to, subject, text);
      return "sent";
    }
    return this.queue(to, subject, text);
  }

  private async queue(to: string, subject: string, text: string): Promise<"queued"> {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "outbox.jsonl"),
      `${JSON.stringify({ at: new Date().toISOString(), to, subject, text })}\n`,
      "utf8",
    );
    return "queued";
  }
}

@Injectable()
export class TurnstileService {
  async verify(token: string | undefined, ip: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) return process.env.NODE_ENV !== "production";
    if (!token) return false;
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    if (!response.ok) return false;
    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true;
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  async start(email: string, password: string): Promise<{ ok: true; devCode?: string } | { ok: false }> {
    const user = await this.prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { ok: false };
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return { ok: false };
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const pepper = process.env.OTP_PEPPER ?? "dev-pepper";
    await this.prisma.otpChallenge.deleteMany({ where: { email: user.email } });
    await this.prisma.otpChallenge.create({
      data: {
        email: user.email,
        codeHash: sha256(`${pepper}:${code}`),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await this.mail.send(user.email, "Code de connexion DATA TRACE SERVICE", `Votre code à 6 chiffres : ${code}\nIl expire dans 10 minutes.`);
    await this.audit.write(user.email, "auth.otp");
    if (process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY) return { ok: true, devCode: code };
    return { ok: true };
  }

  async verify(email: string, password: string, code: string): Promise<string | null> {
    const user = await this.prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { email: user.email },
      orderBy: { expiresAt: "desc" },
    });
    if (!challenge || challenge.expiresAt < new Date() || challenge.attempts >= 5) return null;
    const pepper = process.env.OTP_PEPPER ?? "dev-pepper";
    const hash = sha256(`${pepper}:${code.trim()}`);
    if (!safeEqual(hash, challenge.codeHash)) {
      await this.prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
      return null;
    }
    await this.prisma.otpChallenge.delete({ where: { id: challenge.id } });
    const token = randomBytes(32).toString("hex");
    await this.prisma.session.create({
      data: {
        tokenHash: sha256(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
    });
    await this.audit.write(user.email, "auth.login");
    return token;
  }

  async userFromToken(token: string | undefined): Promise<{ id: string; email: string; name: string } | null> {
    if (!token) return null;
    const session = await this.prisma.session.findUnique({ where: { tokenHash: sha256(token) } });
    if (!session || session.expiresAt < new Date()) return null;
    const user = await this.prisma.adminUser.findUnique({ where: { id: session.userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name };
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token) return;
    await this.prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  }
}
