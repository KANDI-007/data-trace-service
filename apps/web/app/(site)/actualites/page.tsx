import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Crumb } from "@/components/shell";
import { categoryLabels, loadArticles } from "@/lib/content";

export const metadata: Metadata = { title: "Actualités", description: "Nouveautés de DATA TRACE SERVICE, événements et conseils pour les entreprises." };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { filtre } = await searchParams;
  const articles = await loadArticles();
  const visible = filtre ? articles.filter((article) => article.category === filtre) : articles;
  const filters = [["", "Tout"], ["actualite", "Actualités"], ["conseil", "Conseils"], ["evenement", "Événements"]];
  return (
    <>
      <section className="ph2" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div>
            <Crumb items={["Actualités"]} />
            <h1>Actualités et conseils.</h1>
            <p className="lead">Nouveautés de DATA TRACE SERVICE, participation aux événements et conseils pour mieux gérer votre entreprise.</p>
          </div>
        </div>
      </section>
      <section className="s" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="chips" style={{ marginBottom: 28 }}>
            {filters.map(([id, label]) => <Link key={label} href={id ? `/actualites?filtre=${id}` : "/actualites"} className={!filtre && !id || filtre === id ? "on" : undefined} style={!filtre && !id || filtre === id ? { background: "var(--navy)", color: "#fff" } : undefined}>{label}</Link>)}
          </div>
          {visible.length === 0 ? <p>Aucun article dans cette catégorie pour le moment.</p> : null}
          <div style={{ display: "grid", gap: 20 }}>
            {visible.map((article) => (
              <article key={article.slug} className="card" style={{ display: "grid", gridTemplateColumns: "minmax(0,220px) minmax(0,1fr)", gap: 20, overflow: "hidden" }}>
                <div className="pic" style={{ minHeight: 160, position: "relative" }}>
                  <Image src={article.image || "/media/market.jpg"} alt="" fill style={{ objectFit: "cover" }} sizes="220px" />
                </div>
                <div style={{ padding: "20px 20px 20px 0" }}>
                  <p className="mut">{categoryLabels[article.category] ?? article.category} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR") : <span className="todo">date à compléter</span>}</p>
                  <h2 style={{ fontSize: 28, marginTop: 8 }}><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h2>
                  <p className="mut" style={{ marginTop: 8 }}>{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
