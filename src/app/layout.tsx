import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerForge AI - The Intelligent Placement Tutor",
  description:
    "CareerForge AI is an AI-powered placement preparation platform for students: career recommendations, skill-gap analysis, resume review, aptitude practice, mock interviews, and placement readiness analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
