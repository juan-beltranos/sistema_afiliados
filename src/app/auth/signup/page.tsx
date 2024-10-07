"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fields: Array<keyof typeof formData> = ["nombre", "email", "telefono"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { nombre, email, telefono } = formData;
    if (!nombre || !email || !telefono) {
      return "Todos los campos son obligatorios";
    }
    return null;
  };

  const getAffiliateRef = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("AFL") || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    const afiliadoReferente = getAffiliateRef();

    try {
      const { nombre, email, telefono } = formData;

      // 1. Guardar en la colección "afiliados"
      const docRef = await addDoc(collection(db, "afiliados"), {
        nombre,
        email,
        telefono,
        afiliadoReferente,
        comisionAcumulada: 0,
        comisionSubafiliados: 0,
        ventasGeneradas: 0,
        estado: true,
        fechaRegistro: Timestamp.now(),
      });

      // 2. Guardar en la colección de "subAfiliados" si existe un afiliado referente
      if (afiliadoReferente) {
        const subafiliadoRef = doc(collection(db, "afiliados", afiliadoReferente, "subAfiliados"), docRef.id);
        await setDoc(subafiliadoRef, {
          id: docRef.id,
          nombre,
          email,
          telefono,
          afiliadoReferente,
          comisionAcumulada: 0,
          comisionSubafiliados: 0,
          ventasGeneradas: 0,
          estado: true,
          fechaRegistro: Timestamp.now(),
        });
      }

      // Restablecer los campos y redirigir
      setFormData({ nombre: "", email: "", telefono: "" });
      setSuccess(true);
      localStorage.setItem("afiliado", docRef.id);
      router.push(`/dashboard/ebooks/?afiliado=${docRef.id}`);
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Hubo un error al registrar, intenta de nuevo.");
    }
  };


  return (
    <div className="flex flex-wrap items-center h-svh">
      <div className="hidden w-full md:block md:w-1/2">
        <div className="h-svh">
          <Link href="/" className="flex justify-center">
            <Image
              className="dark:block !h-svh object-contain"
              src={"/images/banner.jpg"}
              alt="Logo"
              width={500}
              height={500}
            />
          </Link>
        </div>
      </div>

      <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
        <div className="w-full p-4 sm:p-12.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
            Registro de afiliados
          </h2>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500 text-center">¡Registro exitoso!</p>}

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={`Ingresa tu ${field}`}
                className="w-full rounded-lg mb-5 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            ))}

            <div className="mb-5">
              <input
                type="submit"
                value="Registrarme"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              />
            </div>

            <div className="mt-6 text-center">
              <p>
                ¿Ya estás registrado?{" "}
                <Link href="/auth/signin" className="text-primary">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
