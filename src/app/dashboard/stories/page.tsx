import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormLayout from "@/app/forms/stories/page";

export const metadata: Metadata = {
  title: "Create Storie",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const WordsoupPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Productos" />
      <FormLayout />
    </DefaultLayout>
  );
};

export default WordsoupPage;
