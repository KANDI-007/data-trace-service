import { Body, Controller, Get, Headers, Ip, Param, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { SECTOR_LABELS, type Sector } from "@dts/shared";
import { CreateContactDto, CreateDiagnosticDto, FeedbackDto, LoginDto, VisitDto } from "./dto";
import { AuditService, AuthService, consumeRateLimit, MailService, TurnstileService } from "./services";
import { PrismaService } from "./prisma.service";
import { bodyOf } from "./validate";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  };
}

@Controller()
export class PublicController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly audit: AuditService,
    private readonly turnstile: TurnstileService,
    private readonly auth: AuthService,
  ) {}

  @Get("health")
  health() {
    return { ok: true, service: "dts-api" };
  }

  @Get("settings")
  async settings() {
    const rows = await this.prisma.setting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  }

  @Get("articles")
  async articles() {
    const now = new Date();
    return this.prisma.article.findMany({
      where: { status: "published", OR: [{ publishedAt: null }, { publishedAt: { lte: now } }] },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, excerpt: true, category: true, image: true, publishedAt: true, seoTitle: true },
    });
  }

  @Get("articles/:slug")
  async article(@Param("slug") slug: string) {
    const now = new Date();
    const row = await this.prisma.article.findFirst({
      where: { slug, status: "published", OR: [{ publishedAt: null }, { publishedAt: { lte: now } }] },
    });
    if (!row) return { error: "introuvable" };
    return row;
  }

  @Get("pages/:slug")
  async page(@Param("slug") slug: string) {
    const row = await this.prisma.page.findFirst({ where: { slug, status: "published" } });
    if (!row) return { error: "introuvable" };
    return { slug: row.slug, title: row.title, blocks: JSON.parse(row.blocks) as unknown, updatedAt: row.updatedAt };
  }

  @Post("visites")
  async visit(@Body(bodyOf(VisitDto)) dto: VisitDto) {
    const path = dto.path.startsWith("/") ? dto.path.slice(0, 200) : "/";
    await this.prisma.visit.create({ data: { path } });
    return { ok: true };
  }

  @Post("demandes")
  async createRequest(@Body(bodyOf(CreateDiagnosticDto)) dto: CreateDiagnosticDto, @Ip() ip: string, @Headers("x-forwarded-for") forwarded?: string) {
    const key = (forwarded ?? ip).split(",")[0]?.trim() || "local";
    if (!consumeRateLimit(`demande:${key}`)) return { error: "Trop de demandes. Réessayez dans quelques minutes." };
    if (!(await this.turnstile.verify(dto.turnstileToken, key))) return { error: "Vérification anti-robot à compléter ou refusée." };
    const email = dto.email?.trim() ? dto.email.trim() : null;
    const created = await this.prisma.diagnosticRequest.create({
      data: {
        fullName: dto.fullName.trim(),
        company: dto.company.trim(),
        phone: dto.phone.trim(),
        email,
        sector: dto.sector,
        city: dto.city.trim(),
        concern: dto.concern?.trim() || null,
        consent: true,
        source: dto.source ?? "page",
        events: { create: { action: "créée", detail: "Demande enregistrée" } },
      },
    });
    await this.audit.write("public", "demande.create", created.id);
    const sector = SECTOR_LABELS[dto.sector as Sector] ?? dto.sector;
    const summary = [
      `Nom : ${created.fullName}`,
      `Entreprise : ${created.company}`,
      `Téléphone : ${created.phone}`,
      `E-mail : ${created.email ?? "non renseigné"}`,
      `Secteur : ${sector}`,
      `Ville : ${created.city}`,
      `Souci : ${created.concern ?? "non renseigné"}`,
    ].join("\n");
    const notify = process.env.NOTIFY_EMAIL ?? "datatraceservice@gmail.com";
    const delivery = await this.mail.send(notify, "Nouvelle demande de diagnostic", summary);
    let confirmation: "sent" | "queued" | "skipped" = "skipped";
    if (created.email) {
      confirmation = await this.mail.send(
        created.email,
        "Votre demande de diagnostic — DATA TRACE SERVICE",
        `Bonjour ${created.fullName},\n\nNous avons bien reçu votre demande de diagnostic gratuit pour ${created.company}.\nNous vous répondons dans le délai indiqué sur le site (à compléter si la Gérante ne l’a pas encore fixé).\n\nDATA TRACE SERVICE\nBè Kpota, Lomé, Togo`,
      );
    }
    return { id: created.id, emailDelivery: delivery, confirmation };
  }

  @Post("contact")
  async contact(@Body(bodyOf(CreateContactDto)) dto: CreateContactDto, @Ip() ip: string) {
    if (!consumeRateLimit(`contact:${ip}`)) return { error: "Trop de messages. Réessayez dans quelques minutes." };
    if (!(await this.turnstile.verify(dto.turnstileToken, ip))) return { error: "Vérification anti-robot à compléter ou refusée." };
    const created = await this.prisma.contactMessage.create({
      data: {
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.trim() || null,
        message: dto.message.trim(),
        consent: true,
      },
    });
    await this.audit.write("public", "contact.create", created.id);
    const notify = process.env.NOTIFY_EMAIL ?? "datatraceservice@gmail.com";
    await this.mail.send(notify, "Nouveau message de contact", `${dto.fullName}\n${dto.phone}\n${dto.email ?? ""}\n\n${dto.message}`);
    return { id: created.id };
  }

  @Post("demo/feedback")
  async feedback(@Body(bodyOf(FeedbackDto)) dto: FeedbackDto, @Ip() ip: string) {
    if (!consumeRateLimit(`feedback:${ip}`)) return { error: "Trop d’envois. Réessayez dans quelques minutes." };
    const created = await this.prisma.feedbackDemo.create({
      data: { rating: dto.rating, speed: dto.speed, nps: dto.nps, comment: dto.comment?.trim() || null },
    });
    return { id: created.id };
  }

  @Post("auth/session")
  async session(@Body(bodyOf(LoginDto)) dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    if (!dto.code) {
      const started = await this.auth.start(dto.email, dto.password);
      if (!started.ok) throw new UnauthorizedException("E-mail ou mot de passe incorrect.");
      return { needCode: true, devCode: started.devCode };
    }
    const token = await this.auth.verify(dto.email, dto.password, dto.code);
    if (!token) throw new UnauthorizedException("Code incorrect ou expiré.");
    res.cookie("dts_session", token, cookieOptions());
    return { ok: true };
  }

  @Post("auth/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string> | undefined)?.dts_session;
    await this.auth.logout(token);
    res.clearCookie("dts_session", { path: "/" });
    return { ok: true };
  }

  @Get("auth/me")
  async me(@Req() req: Request) {
    const token = (req.cookies as Record<string, string> | undefined)?.dts_session;
    const user = await this.auth.userFromToken(token);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
