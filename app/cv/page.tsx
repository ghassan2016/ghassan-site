import type { Metadata } from "next";
import { cv } from "@/lib/cv";
import { profile } from "@/lib/data";
import { CvDocument } from "@/components/cv-document";

export const metadata: Metadata = {
  // Also becomes the PDF's document title, which some ATS read.
  title: { absolute: `${cv.name} - ${cv.headline} - CV` },
  description: `${cv.name} — ${cv.headline}. ${cv.summary.slice(0, 120)}…`,
};

// Printed to /public/Ghassan_Ahmed_CV.pdf.
export default function CvPage() {
  return <CvDocument cv={cv} pdfUrl={profile.resumeUrl} />;
}
