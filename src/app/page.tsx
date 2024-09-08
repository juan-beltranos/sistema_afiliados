import LandingPage from "@/components/Dashboard/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Afiliados Stocky",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}
