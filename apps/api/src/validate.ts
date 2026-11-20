import { Type, ValidationPipe } from "@nestjs/common";

export function bodyOf(metatype: Type): ValidationPipe {
  return new ValidationPipe({
    expectedType: metatype,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
}
