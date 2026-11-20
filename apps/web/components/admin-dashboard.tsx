"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminFrame } from "@/components/admin-ui";
import { STATUS_LABELS, type RequestStatus } from "@dts/shared";

interface Dash {
  newCount: number;
  todayReminders: number;
  monthCount: number;
  visits: number;
  latest: { id: string; fullName: string; company: string; status: string; createdAt: string }[];
  byDay: { day: string; count: number }[];
  popular: { path: string; _count: { path: number } }[];
  checklist: { key: string; done: boolean }[];
}

const labels: Record<string, string> = {
  phone: "Téléphone",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  rccm: "RCCM",
  nif: "NIF",
  hours: "Horaires",
  responseDelay: "Délai de réponse",
  pricing: "Tarifs",
  domain: "Nom de domaine",
};

export function Dashboard() {
  const [data, setData] = useState<Dash | null>(null);
  useEffect(() => {
    void fetch("/backend/admin/tableau", { credentials: "include" }).then(async (response) => {
      if (response.ok) setData((await response.json()) as Dash);
    });
  }, []);
  const max = Math.max(1, ...(data?.byDay.map((item) => item.count) ?? [1]));
  return (
    <AdminFrame title="Bonjour" subtitle="Activité enregistrée sur le site. Les compteurs partent de zéro tant qu’il n’y a pas de visites.">
      <div className="k4" style={{ marginBottom: 18 }}>
        <div className="card" style={{ padding: 16 }}><small>Nouvelles demandes</small><b style={{ display: "block", fontSize: 28 }}>{data?.newCount ?? "…"}</b></div>
        <div className="card" style={{ padding: 16 }}><small>À rappeler</small><b style={{ display: "block", fontSize: 28 }}>{data?.todayReminders ?? "…"}</b></div>
        <div className="card" style={{ padding: 16 }}><small>Demandes ce mois</small><b style={{ display: "block", fontSize: 28 }}>{data?.monthCount ?? "…"}</b></div>
        <div className="card" style={{ padding: 16 }}><small>Visites (7 jours)</small><b style={{ display: "block", fontSize: 28 }}>{data?.visits ?? "…"}</b></div>
      </div>
      <div className="g2">
        <div className="pnl">
          <h3>Dernières demandes</h3>
          <table>
            <tbody>
              {(data?.latest ?? []).map((row) => (
                <tr key={row.id}><td><Link href={`/admin/demandes?id=${row.id}`}>{row.company}</Link><div className="mut">{row.fullName}</div></td><td>{STATUS_LABELS[row.status as RequestStatus] ?? row.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pnl">
          <h3>À compléter avant la mise en ligne</h3>
          <div className="cl">
            {(data?.checklist ?? []).map((item) => <div key={item.key}><i className={item.done ? "on" : undefined} />{item.done ? <span className="d">{labels[item.key] ?? item.key}</span> : <span>{labels[item.key] ?? item.key}</span>}</div>)}
          </div>
        </div>
      </div>
      <div className="g2" style={{ marginTop: 18 }}>
        <div className="pnl">
          <h3>Visites</h3>
          <div className="bchart">{(data?.byDay ?? []).map((item) => <i key={item.day} style={{ height: `${Math.max(8, (item.count / max) * 100)}%` }} title={`${item.day} : ${item.count}`} />)}</div>
        </div>
        <div className="pnl">
          <h3>Pages les plus vues</h3>
          <ul>{(data?.popular ?? []).map((item) => <li key={item.path}>{item.path} · {item._count.path}</li>)}</ul>
        </div>
      </div>
    </AdminFrame>
  );
}
