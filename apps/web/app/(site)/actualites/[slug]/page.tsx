import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabels, loadArticle, waLink, loadSettings } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Article" };
  return { title: article.seoTitle || article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([loadArticle(slug), loadSettings()]);
  if (!article) notFound();
  const share = waLink(settings.whatsapp, `${article.title} — DATA TRACE SERVICE`);
  const paragraphs = (article.body ?? article.excerpt).split("\n").filter(Boolean);
  return (
    <article className="s">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div className="crumb"><Link href="/">Accueil</Link> / <Link href="/actualites">Actualités</Link> / <b>{article.title}</b></div>
        <p className="mut">{categoryLabels[article.category] ?? article.category} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR") : "date à compléter"}</p>
        <h1 style={{ fontSize: 42, marginTop: 12 }}>{article.title}</h1>
        <div className="pic" style={{ height: 360, position: "relative", margin: "28px 0" }}>
          <Image src={article.image || "/media/market.jpg"} alt="" fill style={{ objectFit: "cover" }} sizes="820px" priority />
        </div>
        {paragraphs.map((paragraph) => <p key={paragraph} style={{ fontSize: 18, marginBottom: 16 }}>{paragraph}</p>)}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          {share ? <a className="btn w" href={share}>Partager sur WhatsApp</a> : <span className="todo">Partage WhatsApp : numéro à compléter</span>}
          <Link className="btn o" href="/actualites">Toutes les actualités</Link>
        </div>
      </div>
    </article>
  );
}
