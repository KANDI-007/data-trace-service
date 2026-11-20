"use client";

import { SECTOR_LABELS, STATUS_LABELS, REQUEST_STATUSES, type RequestStatus, type Sector } from "@dts/shared";
import { useEffect, useState } from "react";
import { AdminFrame } from "@/components/admin-ui";

interface RequestRow {
  id: string;
  fullName: string;
  company: string;
  phone: string;
  email: string | null;
  sector: string;
  city: string;
  concern: string | null;
  status: string;
  internalNote: string | null;
  createdAt: string;
  events?: { id: string; action: string; detail: string | null; createdAt: string }[];
}

export function RequestsBoard({ initialId }: { initialId?: string }) {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [status, setStatus] = useState("tous");
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<RequestRow | null>(null);
  const [note, setNote] = useState("");

  async function load(nextStatus = status, nextQ = q) {
    const params = new URLSearchParams();
    if (nextStatus !== "tous") params.set("status", nextStatus);
    if (nextQ) params.set("q", nextQ);
    const response = await fetch(`/backend/admin/demandes?${params.toString()}`, { credentials: "include" });
    if (response.ok) setRows((await response.json()) as RequestRow[]);
  }

  useEffect(() => {
    void load();
    if (initialId) void open(initialId);
    // initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function open(id: string) {
    const response = await fetch(`/backend/admin/demandes/${id}`, { credentials: "include" });
    if (!response.ok) return;
    const data = (await response.json()) as RequestRow;
    setCurrent(data);
    setNote(data.internalNote ?? "");
  }

  async function save(nextStatus?: string) {
    if (!current) return;
    await fetch(`/backend/admin/demandes/${current.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus ?? current.status, internalNote: note }),
    });
    await open(current.id);
    await load();
  }

  const digits = current?.phone.replace(/\D/g, "") ?? "";

  return (
    <AdminFrame title="Demandes de diagnostic" subtitle="Filtrez, notez, rappelez. L’export Excel reprend la liste complète.">
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <label>Statut <select className="in" value={status} onChange={(event) => { setStatus(event.target.value); void load(event.target.value, q); }} style={{ width: 180 }}><option value="tous">Tous</option>{REQUEST_STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABELS[item]}</option>)}</select></label>
        <label>Recherche <input className="in" value={q} onChange={(event) => setQ(event.target.value)} onBlur={() => void load()} style={{ width: 220 }} /></label>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn n s" href="/backend/admin/demandes/export">Export Excel</a>
      </div>
      <div className="g2">
        <div className="pnl" style={{ padding: 0 }}>
          <table className="rs">
            <thead><tr><th>Entreprise</th><th>Ville</th><th>Statut</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><button type="button" className="lnk" onClick={() => void open(row.id)}>{row.company}</button><div className="mut">{row.fullName}</div></td>
                  <td>{row.city}</td>
                  <td>{STATUS_LABELS[row.status as RequestStatus] ?? row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="drawer">
          {current ? (
            <>
              <h2 style={{ fontSize: 22 }}>{current.company}</h2>
              <p>{current.fullName} · {SECTOR_LABELS[current.sector as Sector] ?? current.sector} · {current.city}</p>
              <p style={{ marginTop: 8 }}>{current.phone}{current.email ? ` · ${current.email}` : ""}</p>
              <p style={{ marginTop: 8 }}>{current.concern || "Aucun souci précisé."}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {digits.length >= 8 ? <a className="btn n s" href={`tel:+${digits}`}>Appeler</a> : null}
                {digits.length >= 8 ? <a className="btn w s" href={`https://wa.me/${digits}`}>WhatsApp</a> : <span className="todo">Numéro d’essai, non appelable</span>}
              </div>
              <label style={{ display: "block", marginTop: 16 }}>Statut
                <select className="in" value={current.status} onChange={(event) => void save(event.target.value)}>
                  {REQUEST_STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABELS[item]}</option>)}
                </select>
              </label>
              <label style={{ display: "block", marginTop: 12 }}>Note interne
                <textarea className="in ta" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              <button className="btn p" type="button" style={{ marginTop: 12 }} onClick={() => void save()}>Enregistrer la note</button>
              <h3 style={{ marginTop: 20 }}>Historique</h3>
              <div className="tl">{(current.events ?? []).map((event) => <div key={event.id}><i /><div><b>{event.action}</b><div className="mut">{event.detail} · {new Date(event.createdAt).toLocaleString("fr-FR")}</div></div></div>)}</div>
            </>
          ) : <p>Choisissez une demande.</p>}
        </div>
      </div>
    </AdminFrame>
  );
}
