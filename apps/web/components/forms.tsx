"use client";

import { contactSchema, diagnosticSchema, feedbackSchema, SECTOR_LABELS, SECTORS } from "@dts/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";

type Errors = Record<string, string>;

function issues(error: { issues: { path: (string | number)[]; message: string }[] }): Errors {
  const next: Errors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!next[key]) next[key] = issue.message;
  }
  return next;
}

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: response.ok && !data.error, data };
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <div className="err" role="alert"><Icon name="alert" size={15} />{error}</div> : null}
    </div>
  );
}

export function DiagnosticForm({ delay, intro = true }: { delay: string; intro?: boolean }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      company: String(form.get("company") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      sector: String(form.get("sector") ?? ""),
      city: String(form.get("city") ?? ""),
      concern: String(form.get("concern") ?? ""),
      consent: form.get("consent") === "on" ? true : false,
      source: "page" as const,
    };
    const parsed = diagnosticSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(issues(parsed.error));
      return;
    }
    setErrors({});
    setPending(true);
    setFormError("");
    const result = await postJson("/backend/demandes", parsed.data);
    setPending(false);
    if (!result.ok) {
      setFormError(typeof result.data.error === "string" ? result.data.error : "L’envoi n’a pas abouti. Réessayez ou écrivez-nous.");
      return;
    }
    sessionStorage.setItem("dts-demande", JSON.stringify({ fullName: parsed.data.fullName, company: parsed.data.company, sector: SECTOR_LABELS[parsed.data.sector], city: parsed.data.city, confirmation: result.data.confirmation }));
    router.push("/diagnostic-gratuit/merci");
  }

  return (
    <form className="card" style={{ padding: 32 }} onSubmit={onSubmit} noValidate>
      {intro ? (
        <>
          <h2 style={{ fontSize: 24 }}>Demandez votre diagnostic gratuit</h2>
          <p className="mut" style={{ margin: "6px 0 22px", fontSize: 15 }}>Moins d’une minute. Nous vous répondons sous {delay}.</p>
        </>
      ) : null}
      <div className="fm">
        <Field id="fullName" label="Nom et prénoms" error={errors.fullName}>
          <input className={`in ${errors.fullName ? "er" : ""}`} id="fullName" name="fullName" autoComplete="name" />
        </Field>
        <Field id="company" label="Entreprise" error={errors.company}>
          <input className={`in ${errors.company ? "er" : ""}`} id="company" name="company" autoComplete="organization" />
        </Field>
        <div className="two">
          <Field id="phone" label="Téléphone / WhatsApp" error={errors.phone}>
            <input className={`in ${errors.phone ? "er" : ""}`} id="phone" name="phone" autoComplete="tel" inputMode="tel" />
          </Field>
          <Field id="email" label="E-mail (facultatif)" error={errors.email}>
            <input className={`in ${errors.email ? "er" : ""}`} id="email" name="email" type="email" autoComplete="email" />
          </Field>
        </div>
        <div className="two">
          <Field id="sector" label="Secteur d’activité" error={errors.sector}>
            <select className={`in ${errors.sector ? "er" : ""}`} id="sector" name="sector" defaultValue="">
              <option value="">Choisir</option>
              {SECTORS.map((sector) => <option key={sector} value={sector}>{SECTOR_LABELS[sector]}</option>)}
            </select>
          </Field>
          <Field id="city" label="Ville" error={errors.city}>
            <input className={`in ${errors.city ? "er" : ""}`} id="city" name="city" autoComplete="address-level2" />
          </Field>
        </div>
        <Field id="concern" label="Votre principal souci aujourd’hui (facultatif)" error={errors.concern}>
          <textarea className="in ta" id="concern" name="concern" />
        </Field>
        <label className="ck">
          <input type="checkbox" name="consent" style={{ width: 22, height: 22, marginTop: 2 }} />
          <span>J’accepte d’être contacté par DATA TRACE SERVICE au sujet de ma demande.</span>
        </label>
        {errors.consent ? <div className="err" role="alert">{errors.consent}</div> : null}
        {formError ? <div className="err" role="alert">{formError}</div> : null}
        <button className="btn p l" type="submit" disabled={pending} style={{ width: "100%" }}>{pending ? "Envoi…" : "Demander mon diagnostic gratuit"}</button>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on" ? true : false,
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(issues(parsed.error));
      return;
    }
    setPending(true);
    const result = await postJson("/backend/contact", parsed.data);
    setPending(false);
    if (!result.ok) {
      setFormError(typeof result.data.error === "string" ? result.data.error : "L’envoi n’a pas abouti.");
      return;
    }
    setDone(true);
  }

  if (done) return <div className="card" style={{ padding: 32 }}><h2>Message bien reçu</h2><p className="mut" style={{ marginTop: 8 }}>Nous vous répondons dans le délai indiqué sur le site.</p></div>;

  return (
    <form className="card" style={{ padding: 32 }} onSubmit={onSubmit} noValidate>
      <div className="fm">
        <div className="two">
          <Field id="c-name" label="Nom et prénoms" error={errors.fullName}><input className="in" id="c-name" name="fullName" autoComplete="name" /></Field>
          <Field id="c-phone" label="Téléphone / WhatsApp" error={errors.phone}><input className="in" id="c-phone" name="phone" autoComplete="tel" /></Field>
        </div>
        <Field id="c-email" label="E-mail (facultatif)" error={errors.email}><input className="in" id="c-email" name="email" type="email" /></Field>
        <Field id="c-message" label="Votre message" error={errors.message}><textarea className="in ta" id="c-message" name="message" style={{ minHeight: 140 }} /></Field>
        <label className="ck"><input type="checkbox" name="consent" style={{ width: 22, height: 22 }} /><span>J’accepte d’être contacté par DATA TRACE SERVICE au sujet de mon message.</span></label>
        {errors.consent ? <div className="err">{errors.consent}</div> : null}
        {formError ? <div className="err">{formError}</div> : null}
        <button className="btn p l" type="submit" disabled={pending}>Envoyer</button>
      </div>
    </form>
  );
}

export function FeedbackForm() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [nps, setNps] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { rating, speed: String(form.get("speed") ?? ""), nps: nps ?? -1, comment: String(form.get("comment") ?? "") };
    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Choisissez une note, un rythme et une recommandation.");
      return;
    }
    setPending(true);
    const result = await postJson("/backend/demo/feedback", parsed.data);
    setPending(false);
    if (!result.ok) {
      setError("L’envoi de la démonstration n’a pas abouti.");
      return;
    }
    router.push("/demo/feedback/merci");
  }

  return (
    <form className="vote" onSubmit={onSubmit}>
      <p className="tag">Démonstration</p>
      <h1 style={{ fontSize: 28 }}>Votre avis en une minute</h1>
      <p className="mut">Cet écran montre comment un client répond, sans créer de compte. Les réponses de démonstration restent anonymes.</p>
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend style={{ fontWeight: 600, marginBottom: 8 }}>Note globale</legend>
        <div className="rate">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" className={rating === value ? "on" : undefined} aria-pressed={rating === value} onClick={() => setRating(value)} style={{ border: "1.5px solid #C5D1E0", borderRadius: 14, background: rating === value ? "var(--navy)" : "#fff", color: rating === value ? "#fff" : "var(--navy)", fontWeight: 600, fontSize: 20, minHeight: 48 }}>{value}</button>
          ))}
        </div>
      </fieldset>
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend style={{ fontWeight: 600, marginBottom: 8 }}>Le service a été</legend>
        {[["rapide", "Rapide"], ["correcte", "Correct"], ["lente", "Lent"]].map(([value, label]) => (
          <label key={value} style={{ display: "flex", gap: 10, minHeight: 44, alignItems: "center" }}>
            <input type="radio" name="speed" value={value} /> {label}
          </label>
        ))}
      </fieldset>
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend style={{ fontWeight: 600, marginBottom: 8 }}>Recommanderiez-vous cet endroit ? (0 à 10)</legend>
        <div className="nps">
          {Array.from({ length: 11 }, (_, value) => (
            <button key={value} type="button" aria-pressed={nps === value} onClick={() => setNps(value)} style={{ border: "1.5px solid #C5D1E0", borderRadius: 8, background: nps === value ? "var(--teal)" : "#fff", fontWeight: 600, minHeight: 36 }}>{value}</button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="comment" style={{ fontWeight: 600 }}>Commentaire (facultatif)</label>
      <textarea className="in ta" id="comment" name="comment" />
      {error ? <div className="err" role="alert">{error}</div> : null}
      <button className="btn p l" type="submit" disabled={pending}>Envoyer mon avis</button>
    </form>
  );
}
