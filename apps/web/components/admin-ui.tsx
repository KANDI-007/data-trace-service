"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface AdminUser { id: string; email: string; name: string }

export function useAdmin() {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  useEffect(() => {
    void fetch("/backend/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          setUser(null);
          return;
        }
        setUser((await response.json()) as AdminUser);
      })
      .catch(() => setUser(null));
  }, []);
  return user;
}

const links = [
  ["/admin", "Tableau de bord"],
  ["/admin/demandes", "Demandes"],
  ["/admin/pages", "Pages et textes"],
  ["/admin/actualites", "Actualités"],
  ["/admin/medias", "Médias"],
  ["/admin/parametres", "Paramètres"],
];

export function AdminFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const user = useAdmin();
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (user === null) router.replace("/admin/connexion");
  }, [user, router]);
  if (!user) return <p style={{ padding: 32 }}>Chargement de l’espace…</p>;
  return (
    <div className="adm">
      <aside className="side">
        <img src="/media/logo-white.png" alt="DATA TRACE SERVICE" width={180} height={42} className="logo" style={{ height: 42, width: "auto" }} />
        {links.map(([href, label]) => <Link key={href} href={href} className={path === href ? "on" : undefined}>{label}</Link>)}
        <div className="me"><i>{user.name.slice(0, 1)}</i><span>{user.name}</span></div>
      </aside>
      <div className="main">
        <div className="top">
          <div><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>
          <button className="btn o s" type="button" onClick={() => { void fetch("/backend/auth/logout", { method: "POST", credentials: "include" }).then(() => router.push("/admin/connexion")); }}>Quitter</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const response = await fetch("/backend/auth/session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        code: String(form.get("code") ?? ""),
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { needCode?: boolean; devCode?: string; message?: string };
    setPending(false);
    if (!response.ok) {
      setError(typeof data.message === "string" ? data.message : "Connexion refusée.");
      return;
    }
    if (data.needCode) {
      setDevCode(data.devCode ?? "");
      setError(data.devCode ? "Code local affiché ci-dessous. Saisissez-le puis validez à nouveau." : "Un code a été envoyé. Saisissez-le puis validez à nouveau.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="login-grid">
      <div className="login-aside" style={{ background: "var(--navy-d)", color: "#fff", padding: 56, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <img src="/media/logo-white.png" alt="DATA TRACE SERVICE" width={220} height={64} style={{ height: 64, width: "auto" }} />
        <div>
          <h1 style={{ color: "#fff", fontSize: 42, lineHeight: 1.1 }}>Votre site, vos textes, vos demandes.</h1>
          <p style={{ color: "#B9C8DE", marginTop: 16, maxWidth: 460 }}>Modifiez vos pages, publiez vos actualités et suivez les demandes de diagnostic, sans l’aide d’un développeur.</p>
        </div>
        <span>Traçabilité · Organisation · Qualité</span>
      </div>
      <form onSubmit={onSubmit} style={{ display: "grid", placeItems: "center", padding: 28 }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <h2>Connexion</h2>
          <p className="mut" style={{ margin: "8px 0 20px" }}>Accès réservé à la Gérante et à l’équipe.</p>
          <div className="fm">
            <div><label htmlFor="email">E-mail</label><input className="in" id="email" name="email" type="email" autoComplete="username" required /></div>
            <div><label htmlFor="password">Mot de passe</label><input className="in" id="password" name="password" type="password" autoComplete="current-password" required /></div>
            <div><label htmlFor="code">Code à 6 chiffres</label><input className="in" id="code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} /></div>
            {devCode ? <p>Code de cet environnement local : <b>{devCode}</b></p> : null}
            {error ? <p className="err" role="alert">{error}</p> : null}
            <button className="btn p l" type="submit" disabled={pending}>Accéder à l’espace</button>
          </div>
        </div>
      </form>
    </div>
  );
}
