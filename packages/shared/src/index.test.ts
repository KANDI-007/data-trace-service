import assert from "node:assert/strict";
import test from "node:test";
import { contactSchema, diagnosticSchema, feedbackSchema } from "./index";

test("diagnostic rejects a short phone and a missing name", () => {
  const result = diagnosticSchema.safeParse({
    fullName: "A",
    company: "Boulangerie",
    phone: "+228 9",
    email: "",
    sector: "commerce",
    city: "Lomé",
    consent: true,
  });
  assert.equal(result.success, false);
  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    assert.ok(messages.includes("Indiquez votre nom et prénoms."));
    assert.ok(messages.includes("Numéro trop court."));
  }
});

test("contact accepts a message without e-mail", () => {
  const result = contactSchema.safeParse({
    fullName: "Ama Koffi",
    phone: "90000000",
    email: "",
    message: "Je souhaite un diagnostic.",
    consent: true,
  });
  assert.equal(result.success, true);
});

test("feedback score stays between 0 and 10", () => {
  assert.equal(feedbackSchema.safeParse({ rating: 4, speed: "rapide", nps: 11 }).success, false);
  assert.equal(feedbackSchema.safeParse({ rating: 4, speed: "rapide", nps: 8, comment: "" }).success, true);
});
