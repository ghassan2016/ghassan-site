import type { Metadata } from "next";
import { cvBackend } from "@/lib/cv";
import { CvDocument } from "@/components/cv-document";

export const metadata: Metadata = {
  title: { absolute: `${cvBackend.name} - Senior Backend Engineer - CV` },
  description: `${cvBackend.name} — ${cvBackend.headline}.`,
  // Role-specific variant: shared by link, kept out of search results.
  robots: { index: false, follow: false },
};

// Printed to /public/Ghassan_Ahmed_CV_Backend.pdf.
export default function BackendCvPage() {
  return <CvDocument cv={cvBackend} pdfUrl="/Ghassan_Ahmed_CV_Backend.pdf" />;
}
