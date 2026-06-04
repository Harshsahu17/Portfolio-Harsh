import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESC,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
