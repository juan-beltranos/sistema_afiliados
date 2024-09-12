import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormLayout from "@/app/forms/coloringbook/page";

export const metadata: Metadata = {
  title: "Ebook Ia - Coloring Book",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};
const ColoringBookPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Referidos" />
      <FormLayout />
    </DefaultLayout>
  );
};

export default ColoringBookPage;
