"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from '@/app/lib/firebase'; // Ajusta la ruta según la ubicación de tu archivo
import { collection, query, where, getDocs } from "firebase/firestore";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Considera renombrar esto a 'phone' si corresponde
  const [error, setError] = useState("");

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const usersRef = collection(db, "afiliados");
      const q = query(usersRef, where("email", "==", email), where("telefono", "==", password));
      const querySnapshot = await getDocs(q);

      // Extraer información de los documentos
      const users = querySnapshot.docs.map(doc => ({ id: doc.id }));

      // Verifica si el documento existe
      if (!querySnapshot.empty) {
        localStorage.setItem('afiliado', users[0].id)
        window.location.href = `/dashboard/ebooks/?afiliado=${users[0].id}`;
      } else {
        setError("Error al iniciar sesión. Verifica tu email y teléfono.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor. Intenta nuevamente.");
    }
  };

  const validateSesion = () => {
    if (localStorage.getItem('afiliado')) {
      window.location.href = `/dashboard/ebooks/?afiliado=${localStorage.getItem('afiliado')}`;
    }
  }

  useEffect(() => {
    validateSesion()
  }, [])


  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center h-svh">

        <div className="hidden w-full md:block md:w-1/2">
          <div className="h-svh">
            <Link className="flex justify-center" href="/">
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

        <div className="w-full border-stroke dark:border-strokedark md:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Iniciar sesión
            </h2>

            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Ingresa tu teléfono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 mb-4">{error}</div>}

              <div className="mb-5">
                <input
                  type="submit"
                  value="Iniciar sesión"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-5 text-center text-base font-medium text-black dark:text-white">
                ¿No te has registrado?
                <Link
                  href="/auth/signup"
                  className="ml-2.5 text-primary transition hover:underline dark:text-primarylight"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SignIn;
