import type { Metadata } from "next";
import AuthCard from "@/components/AuthCard";

export const metadata: Metadata = {
  title: "Zaloguj się – Fiszki AI",
  description: "Zaloguj się do swojego konta Fiszki i kontynuuj naukę ze zdjęć.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <AuthCard initialMode="login" initialError={params?.error} />;
}
