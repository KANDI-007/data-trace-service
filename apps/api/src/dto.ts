import { Equals, IsEmail, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { REQUEST_STATUSES, SECTORS } from "@dts/shared";

export class CreateDiagnosticDto {
  @IsString()
  @MinLength(2, { message: "Indiquez votre nom et prénoms." })
  fullName!: string;

  @IsString()
  @MinLength(2, { message: "Indiquez le nom de votre entreprise." })
  company!: string;

  @IsString()
  @MinLength(8, { message: "Numéro trop court." })
  phone!: string;

  @ValidateIf((dto: CreateDiagnosticDto) => Boolean(dto.email && dto.email.trim() !== ""))
  @IsEmail({}, { message: "Adresse e-mail invalide." })
  email?: string;

  @IsIn([...SECTORS], { message: "Choisissez un secteur." })
  sector!: string;

  @IsString()
  @MinLength(2, { message: "Indiquez votre ville." })
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  concern?: string;

  @Equals(true, { message: "Le consentement est nécessaire pour vous répondre." })
  consent!: boolean;

  @IsOptional()
  @IsIn(["page", "accueil"])
  source?: string;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}

export class CreateContactDto {
  @IsString()
  @MinLength(2, { message: "Indiquez votre nom et prénoms." })
  fullName!: string;

  @IsString()
  @MinLength(8, { message: "Numéro trop court." })
  phone!: string;

  @ValidateIf((dto: CreateContactDto) => Boolean(dto.email && dto.email.trim() !== ""))
  @IsEmail({}, { message: "Adresse e-mail invalide." })
  email?: string;

  @IsString()
  @MinLength(10, { message: "Écrivez un message un peu plus précis." })
  message!: string;

  @Equals(true, { message: "Le consentement est nécessaire pour vous répondre." })
  consent!: boolean;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}

export class FeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsIn(["rapide", "correcte", "lente"])
  speed!: string;

  @IsInt()
  @Min(0)
  @Max(10)
  nps!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsIn([...REQUEST_STATUSES])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  internalNote?: string;
}

export class VisitDto {
  @IsString()
  @MaxLength(200)
  path!: string;
}

export class PageDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  blocks!: string;

  @IsIn(["draft", "published"])
  status!: string;
}

export class ArticleDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  excerpt!: string;

  @IsString()
  body!: string;

  @IsIn(["actualite", "conseil", "evenement"])
  category!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsIn(["draft", "published", "scheduled"])
  status!: string;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}

export class SettingsDto {
  @IsString()
  values!: string;
}
