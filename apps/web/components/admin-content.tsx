"use client";

import { useEffect, useState } from "react";
import { AdminFrame } from "@/components/admin-ui";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  image: string | null;
  seoTitle: string | null;
  status: string;
  publishedAt: string | null;
}

const empty: Article = { id: "", title: "", slug: "", excerpt: "", body: "", category: "actualite", image: "", seoTitle: "", status: "draft", publishedAt: null };

export function ArticlesAdmin() {
  const [rows, setRows] = useState<Article[]>([]);
  const [current, setCurrent] = useState<Article>(empty);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/backend/admin/actualites", { credentials: "include" });
    if (response.ok) setRows((await response.json()) as Article[]);
  }
  useEffect(() => { void load(); }, []);

  async function save() {
    const payload = { ...current, image: current.image ?? "", seoTitle: current.seoTitle ?? "", publishedAt: current.publishedAt ?? "" };
    const response = await fetch(current.id ? `/backend/admin/actualites/${current.id}` : "/backend/admin/actualites", {
      method: current.id ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMessage(response.ok ? "Article enregistré." : "Enregistrement impossible.");
    if (response.ok) {
      setCurrent((await response.json()) as Article);
      await load();
    }
  }

  return (
    <AdminFrame title="Actualités" subtitle="Publiez un article ou programmez-le avec une date.">
      <div className="g2">
        <div className="pnl">
          <button className="btn o s" type="button" onClick={() => setCurrent(empty)}>Nouvel article</button>
          <ul style={{ marginTop: 12 }}>{rows.map((row) => <li key={row.id}><button type="button" className="lnk" onClick={() => setCurrent(row)}>{row.title}</button> · {row.status}</li>)}</ul>
        </div>
        <div className="pnl">
          <label>Titre<input className="in" value={current.title} onChange={(event) => setCurrent({ ...current, title: event.target.value })} /></label>
          <label>Adresse (slug)<input className="in" value={current.slug} onChange={(event) => setCurrent({ ...current, slug: event.target.value })} /></label>
          <label>Catégorie<select className="in" value={current.category} onChange={(event) => setCurrent({ ...current, category: event.target.value })}><option value="actualite">Actualités</option><option value="conseil">Conseils</option><option value="evenement">Événements</option></select></label>
          <label>Image<input className="in" value={current.image ?? ""} onChange={(event) => setCurrent({ ...current, image: event.target.value })} placeholder="/media/market.jpg" /></label>
          <label>Résumé<textarea className="in ta" value={current.excerpt} onChange={(event) => setCurrent({ ...current, excerpt: event.target.value })} /></label>
          <label>Texte<textarea className="in ta" style={{ minHeight: 160 }} value={current.body} onChange={(event) => setCurrent({ ...current, body: event.target.value })} /></label>
          <label>Titre pour Google<input className="in" value={current.seoTitle ?? ""} onChange={(event) => setCurrent({ ...current, seoTitle: event.target.value })} /></label>
          <label>Statut<select className="in" value={current.status} onChange={(event) => setCurrent({ ...current, status: event.target.value })}><option value="draft">Brouillon</option><option value="published">Publier</option><option value="scheduled">Programmer</option></select></label>
          <label>Date de publication<input className="in" type="datetime-local" value={current.publishedAt ? current.publishedAt.slice(0, 16) : ""} onChange={(event) => setCurrent({ ...current, publishedAt: event.target.value ? new Date(event.target.value).toISOString() : null })} /></label>
          <button className="btn p" type="button" style={{ marginTop: 12 }} onClick={() => void save()}>Enregistrer</button>
          {message ? <p>{message}</p> : null}
        </div>
      </div>
    </AdminFrame>
  );
}

interface MediaRow { id: string; filename: string; alt: string; path: string }

export function MediaAdmin() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [alt, setAlt] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/backend/admin/medias", { credentials: "include" });
    if (response.ok) setRows((await response.json()) as MediaRow[]);
  }
  useEffect(() => { void load(); }, []);

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    body.set("alt", alt || "à compléter");
    const response = await fetch("/backend/admin/medias", { method: "POST", body, credentials: "include" });
    setMessage(response.ok ? "Image convertie en WebP." : "Import impossible.");
    if (response.ok) await load();
  }

  return (
    <AdminFrame title="Médias" subtitle="Les images importées sont réduites et converties en WebP.">
      <div className="pnl">
        <label>Texte alternatif<input className="in" value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="à compléter" /></label>
        <input style={{ marginTop: 12 }} type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
        {message ? <p>{message}</p> : null}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 18 }}>
          {rows.map((row) => (
            <figure key={row.id} className="card" style={{ padding: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/backend${row.path}`} alt={row.alt} style={{ width: "100%", height: 120, objectFit: "cover" }} />
              <figcaption className="mut">{row.alt}<br />{row.path}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </AdminFrame>
  );
}

const fields = ["phone", "whatsapp", "email", "address", "hours", "responseDelay", "facebook", "instagram", "linkedin", "tiktok", "rccm", "nif", "area", "pricing", "domain", "agroModules", "testimonials", "locale"];

export function SettingsAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  useEffect(() => { void fetch("/backend/admin/parametres", { credentials: "include" }).then(async (r) => { if (r.ok) setValues(await r.json()); }); }, []);
  async function save() {
    const response = await fetch("/backend/admin/parametres", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: JSON.stringify(values) }),
    });
    setMessage(response.ok ? "Paramètres enregistrés." : "Enregistrement impossible.");
  }
  return (
    <AdminFrame title="Paramètres du site" subtitle="Laissez « à compléter » tant que l’information n’est pas confirmée.">
      <div className="pnl" style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        {fields.map((key) => (
          <label key={key}>{key}<input className="in" value={values[key] ?? ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /></label>
        ))}
        <button className="btn p" type="button" onClick={() => void save()}>Enregistrer</button>
        {message ? <p>{message}</p> : null}
      </div>
    </AdminFrame>
  );
}
