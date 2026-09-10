import type { Metadata } from "next";
import AuthCard from "@/components/AuthCard";

export const metadata: Metadata = {
  title: "Zarejestruj się – Fiszki AI",
  description: "Utwórz darmowe konto Fiszki i twórz fiszki ze zdjęć odręcznych notatek.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <AuthCard initialMode="register" initialError={params?.error} />;
}
