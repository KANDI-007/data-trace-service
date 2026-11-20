import { Module } from "@nestjs/common";
import { AdminController, SessionGuard } from "./admin.controller";
import { PrismaService } from "./prisma.service";
import { PublicController } from "./public.controller";
import { AuditService, AuthService, MailService, TurnstileService } from "./services";

@Module({
  controllers: [PublicController, AdminController],
  providers: [PrismaService, MailService, AuditService, TurnstileService, AuthService, SessionGuard],
})
export class AppModule {}
