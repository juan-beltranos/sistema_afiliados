"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/app/lib/firebase"; // Importa la configuración de Firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'; // Para generar un código de afiliado único

const SignUp: React.FC = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigoAfiliado, setCodigoAfiliado] = useState(uuidv4()); // Generar código único
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || !email || !telefono) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // 1. Guardar en la colección "afiliados"
      const docRef = await addDoc(collection(db, "afiliados"), {
        nombre,
        email,
        telefono,
        fechaRegistro: Timestamp.now(), // Fecha actual
        codigoAfiliado, // Código único generado
        ventasGeneradas: 0, // Valor inicial
        comisionAcumulada: 0, // Valor inicial
        estado: true, // Estado inicial
      });

      // Limpiar el formulario
      setNombre("");
      setEmail("");
      setTelefono("");
      setCodigoAfiliado(uuidv4()); // Generar nuevo código único para el siguiente registro
      setSuccess(true);
      window.location.href = `/dashboard/ebooks/?afiliado=${docRef.id}`;
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Hubo un error al registrar, intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-wrap items-center h-svh">
      <div className="hidden w-full md:block md:w-1/2">
        <div className="h-svh">
          <Link href="/">
            <Image
              className="dark:block !h-svh object-cover"
              src={"/images/banner.jpg"}
              alt="Logo"
              width={800}
              height={800}
            />
          </Link>
        </div>
      </div>

      <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
        <div className="w-full p-4 sm:p-12.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Registro de afiliados
          </h2>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">¡Registro exitoso!</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Correo
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
            </div>

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
                  Iniciar Sesión
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
