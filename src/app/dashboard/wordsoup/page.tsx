import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormLayout from "@/app/forms/wordsoup/page";

export const metadata: Metadata = {
  title: "Create Wordsoup",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const WordsoupPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Wordsoup" />
      <FormLayout />
    </DefaultLayout>
  );
};

export default WordsoupPage;
