import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormLayout from "@/app/forms/crossword/page";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CrosswordPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ventas" />
      <FormLayout />
    </DefaultLayout>
  );
};

export default CrosswordPage;
