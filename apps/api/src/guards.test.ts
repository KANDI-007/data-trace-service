import assert from "node:assert/strict";
import test from "node:test";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateDiagnosticDto } from "./dto";
import { consumeRateLimit, resetRateLimits } from "./services";

test("class-validator rejects a short phone", async () => {
  const dto = plainToInstance(CreateDiagnosticDto, {
    fullName: "",
    company: "Atelier",
    phone: "+228 9",
    sector: "commerce",
    city: "Lomé",
    consent: true,
  });
  const errors = await validate(dto);
  const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
  assert.ok(messages.includes("Indiquez votre nom et prénoms."));
  assert.ok(messages.includes("Numéro trop court."));
});

test("rate limit allows five posts then blocks", () => {
  resetRateLimits();
  for (let index = 0; index < 5; index += 1) assert.equal(consumeRateLimit("test-ip"), true);
  assert.equal(consumeRateLimit("test-ip"), false);
});
