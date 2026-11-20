"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminFrame } from "@/components/admin-ui";

interface PageRow { slug: string; title: string; status: string; updatedAt: string }
interface Block { key: string; label: string; value: string }
interface Version { id: string; title: string; createdAt: string; note: string | null }

export function PagesList() {
  const [rows, setRows] = useState<PageRow[]>([]);
  useEffect(() => { void fetch("/backend/admin/pages", { credentials: "include" }).then(async (r) => { if (r.ok) setRows(await r.json()); }); }, []);
  return (
    <AdminFrame title="Pages et textes" subtitle="Les textes publiés remplacent l’accroche et l’introduction sur le site.">
      <div className="pnl">
        <table>
          <tbody>
            {rows.map((row) => <tr key={row.slug}><td><Link href={`/admin/pages/${row.slug}`}>{row.title}</Link><div className="mut">{row.slug} · {row.status}</div></td></tr>)}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}

export function PageEditor({ slug }: { slug: string }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [message, setMessage] = useState("");
  const [wide, setWide] = useState(true);

  useEffect(() => {
    void fetch(`/backend/admin/pages/${slug}`, { credentials: "include" }).then(async (response) => {
      if (!response.ok) return;
      const data = await response.json() as { title: string; status: string; blocks: Block[]; versions: Version[] };
      setTitle(data.title);
      setStatus(data.status);
      setBlocks(data.blocks);
      setVersions(data.versions);
    });
  }, [slug]);

  async function save(next: "draft" | "published") {
    const response = await fetch(`/backend/admin/pages/${slug}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status: next, blocks: JSON.stringify(blocks) }),
    });
    setMessage(response.ok ? (next === "published" ? "Publié. Le site public lit cette version tout de suite." : "Brouillon enregistré.") : "Enregistrement impossible.");
    if (response.ok) setStatus(next);
  }

  return (
    <AdminFrame title="Modifier la page" subtitle={slug}>
      <div className="g2">
        <div className="pnl">
          <label>Titre<input className="in" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          {blocks.map((block, index) => (
            <label key={block.key} style={{ display: "block", marginTop: 12 }}>{block.label}
              <textarea className="in ta" value={block.value} onChange={(event) => setBlocks(blocks.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} />
            </label>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn o" type="button" onClick={() => void save("draft")}>Brouillon</button>
            <button className="btn p" type="button" onClick={() => void save("published")}>Publier</button>
          </div>
          {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
          <h3 style={{ marginTop: 20 }}>Versions</h3>
          <ul>{versions.map((version) => <li key={version.id}>{new Date(version.createdAt).toLocaleString("fr-FR")} · {version.note}</li>)}</ul>
        </div>
        <div className="pnl">
          <div className="seg" style={{ marginBottom: 12 }}>
            <button type="button" className={wide ? "on" : undefined} onClick={() => setWide(true)} style={{ background: "transparent", border: 0 }}>Ordinateur</button>
            <button type="button" onClick={() => setWide(false)} style={{ background: "transparent", border: 0 }}>Téléphone</button>
          </div>
          <div style={{ width: wide ? "100%" : 360, border: "1px solid var(--line)", borderRadius: 16, padding: 16 }}>
            <p className="mut">Aperçu {status}</p>
            <h2 style={{ fontSize: wide ? 32 : 24 }}>{title}</h2>
            {blocks.map((block) => <p key={block.key} style={{ marginTop: 10 }}>{block.value}</p>)}
          </div>
        </div>
      </div>
    </AdminFrame>
  );
}
