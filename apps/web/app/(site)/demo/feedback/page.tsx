import type { Metadata } from "next";
import { FeedbackForm } from "@/components/forms";

export const metadata: Metadata = { title: "Démonstration FeedBack", description: "Questionnaire de démonstration : note, rapidité et recommandation, sans compte." };

export default function DemoPage() {
  return <FeedbackForm />;
}
