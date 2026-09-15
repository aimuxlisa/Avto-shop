import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM System",
  description: "Standalone CRM platform with analytics and Kanban pipeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
