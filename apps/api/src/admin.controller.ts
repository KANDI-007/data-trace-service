import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  BadRequestException,
  Body,
  CanActivate,
  Controller,
  ExecutionContext,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { STATUS_LABELS, type RequestStatus } from "@dts/shared";
import ExcelJS from "exceljs";
import type { Request, Response } from "express";
import sharp from "sharp";
import { ArticleDto, PageDto, SettingsDto, UpdateRequestDto } from "./dto";
import { PrismaService } from "./prisma.service";
import { AuditService, AuthService } from "./services";
import { bodyOf } from "./validate";

interface Actor {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: Actor }>();
    const token = (req.cookies as Record<string, string> | undefined)?.dts_session;
    const user = await this.auth.userFromToken(token);
    if (!user) throw new UnauthorizedException();
    req.user = user;
    return true;
  }
}

function actorOf(req: Request & { user?: Actor }): Actor {
  if (!req.user) throw new UnauthorizedException();
  return req.user;
}

@Controller("admin")
@UseGuards(SessionGuard)
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get("tableau")
  async dashboard() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [newCount, todayReminders, monthCount, visits, latest, settings] = await Promise.all([
      this.prisma.diagnosticRequest.count({ where: { status: "nouveau" } }),
      this.prisma.diagnosticRequest.count({ where: { status: "rappel" } }),
      this.prisma.diagnosticRequest.count({ where: { createdAt: { gte: new Date(start.getFullYear(), start.getMonth(), 1) } } }),
      this.prisma.visit.count({ where: { createdAt: { gte: week } } }),
      this.prisma.diagnosticRequest.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      this.prisma.setting.findMany(),
    ]);
    const byDay: { day: string; count: number }[] = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const from = new Date(start);
      from.setDate(from.getDate() - offset);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      const count = await this.prisma.visit.count({ where: { createdAt: { gte: from, lt: to } } });
      byDay.push({ day: from.toLocaleDateString("fr-FR", { weekday: "short" }), count });
    }
    const popular = await this.prisma.visit.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 5 });
    const checklist = settings
      .filter((row) => ["phone", "whatsapp", "facebook", "instagram", "linkedin", "tiktok", "rccm", "nif", "hours", "responseDelay", "pricing", "domain"].includes(row.key))
      .map((row) => ({ key: row.key, label: row.key, done: row.value.trim().toLowerCase() !== "à compléter" && row.value.trim() !== "" }));
    return { newCount, todayReminders, monthCount, visits, latest, byDay, popular, checklist };
  }

  @Get("demandes/export")
  async export(@Res() res: Response) {
    const rows = await this.prisma.diagnosticRequest.findMany({ orderBy: { createdAt: "desc" } });
    const book = new ExcelJS.Workbook();
    const sheet = book.addWorksheet("Demandes");
    sheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Nom", key: "fullName", width: 28 },
      { header: "Entreprise", key: "company", width: 28 },
      { header: "Téléphone", key: "phone", width: 18 },
      { header: "E-mail", key: "email", width: 28 },
      { header: "Secteur", key: "sector", width: 22 },
      { header: "Ville", key: "city", width: 16 },
      { header: "Statut", key: "status", width: 16 },
      { header: "Souci", key: "concern", width: 40 },
    ];
    rows.forEach((row) => {
      sheet.addRow({
        date: row.createdAt.toISOString(),
        fullName: row.fullName,
        company: row.company,
        phone: row.phone,
        email: row.email ?? "",
        sector: row.sector,
        city: row.city,
        status: STATUS_LABELS[row.status as RequestStatus] ?? row.status,
        concern: row.concern ?? "",
      });
    });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=demandes-dts.xlsx");
    await book.xlsx.write(res);
    res.end();
  }

  @Get("demandes")
  async list(@Query("status") status?: string, @Query("q") q?: string) {
    return this.prisma.diagnosticRequest.findMany({
      where: {
        status: status && status !== "tous" ? status : undefined,
        OR: q
          ? [
              { fullName: { contains: q } },
              { company: { contains: q } },
              { city: { contains: q } },
              { phone: { contains: q } },
            ]
          : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  @Get("demandes/:id")
  async one(@Param("id") id: string) {
    const row = await this.prisma.diagnosticRequest.findUnique({ where: { id }, include: { events: { orderBy: { createdAt: "desc" } } } });
    if (!row) throw new BadRequestException("Demande introuvable.");
    return row;
  }

  @Patch("demandes/:id")
  async update(@Param("id") id: string, @Body(bodyOf(UpdateRequestDto)) dto: UpdateRequestDto, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    const current = await this.prisma.diagnosticRequest.findUnique({ where: { id } });
    if (!current) throw new BadRequestException("Demande introuvable.");
    const data: { status?: string; internalNote?: string } = {};
    if (dto.status) data.status = dto.status;
    if (dto.internalNote !== undefined) data.internalNote = dto.internalNote;
    const updated = await this.prisma.diagnosticRequest.update({ where: { id }, data });
    if (dto.status && dto.status !== current.status) {
      await this.prisma.diagnosticEvent.create({
        data: { requestId: id, action: "statut", detail: dto.status },
      });
    }
    if (dto.internalNote !== undefined && dto.internalNote !== current.internalNote) {
      await this.prisma.diagnosticEvent.create({ data: { requestId: id, action: "note", detail: "Note interne mise à jour" } });
    }
    await this.audit.write(user.email, "demande.update", id);
    return updated;
  }

  @Get("pages")
  pages() {
    return this.prisma.page.findMany({ orderBy: { title: "asc" } });
  }

  @Get("pages/:slug")
  async page(@Param("slug") slug: string) {
    const row = await this.prisma.page.findUnique({ where: { slug }, include: { versions: { orderBy: { createdAt: "desc" }, take: 12 } } });
    if (!row) throw new BadRequestException("Page introuvable.");
    return { ...row, blocks: JSON.parse(row.blocks) as unknown };
  }

  @Put("pages/:slug")
  async savePage(@Param("slug") slug: string, @Body(bodyOf(PageDto)) dto: PageDto, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    let blocks: unknown;
    try {
      blocks = JSON.parse(dto.blocks);
    } catch {
      throw new BadRequestException("Blocs illisibles.");
    }
    const serialized = JSON.stringify(blocks);
    const existing = await this.prisma.page.findUnique({ where: { slug } });
    if (!existing) throw new BadRequestException("Page introuvable.");
    await this.prisma.pageVersion.create({ data: { pageId: existing.id, title: existing.title, blocks: existing.blocks, note: "Avant enregistrement" } });
    const saved = await this.prisma.page.update({
      where: { slug },
      data: { title: dto.title, blocks: serialized, status: dto.status },
    });
    await this.audit.write(user.email, "page.save", slug);
    return saved;
  }

  @Get("actualites")
  articles() {
    return this.prisma.article.findMany({ orderBy: { updatedAt: "desc" } });
  }

  @Post("actualites")
  async createArticle(@Body(bodyOf(ArticleDto)) dto: ArticleDto, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    const created = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        body: dto.body,
        category: dto.category,
        image: dto.image || null,
        seoTitle: dto.seoTitle || null,
        status: dto.status,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : dto.status === "published" ? new Date() : null,
      },
    });
    await this.audit.write(user.email, "article.create", created.id);
    return created;
  }

  @Put("actualites/:id")
  async saveArticle(@Param("id") id: string, @Body(bodyOf(ArticleDto)) dto: ArticleDto, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    const saved = await this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        body: dto.body,
        category: dto.category,
        image: dto.image || null,
        seoTitle: dto.seoTitle || null,
        status: dto.status,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : dto.status === "published" ? new Date() : null,
      },
    });
    await this.audit.write(user.email, "article.save", id);
    return saved;
  }

  @Get("medias")
  media() {
    return this.prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post("medias")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 8 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: { buffer: Buffer } | undefined, @Body("alt") alt: string | undefined, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    if (!file) throw new BadRequestException("Fichier manquant.");
    const image = sharp(file.buffer).rotate().resize({ width: 1600, withoutEnlargement: true });
    const buffer = await image.webp({ quality: 80 }).toBuffer();
    const filename = `${Date.now()}-${randomBytes(4).toString("hex")}.webp`;
    const dir = path.join(process.cwd(), "data", "media");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    const created = await this.prisma.media.create({
      data: { filename, alt: alt?.trim() || "à compléter", path: `/fichiers/${filename}`, mime: "image/webp" },
    });
    await this.audit.write(user.email, "media.upload", created.id);
    return created;
  }

  @Get("parametres")
  async settings() {
    const rows = await this.prisma.setting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  }

  @Put("parametres")
  async saveSettings(@Body(bodyOf(SettingsDto)) dto: SettingsDto, @Req() req: Request & { user?: Actor }) {
    const user = actorOf(req);
    let values: Record<string, string>;
    try {
      values = JSON.parse(dto.values) as Record<string, string>;
    } catch {
      throw new BadRequestException("Paramètres illisibles.");
    }
    const entries = Object.entries(values).filter((entry): entry is [string, string] => typeof entry[1] === "string");
    for (const [key, value] of entries) {
      await this.prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
    await this.audit.write(user.email, "settings.save");
    return { ok: true };
  }
}
