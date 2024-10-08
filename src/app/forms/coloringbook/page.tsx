"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Afiliado {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: {
    seconds: number;
    nanoseconds: number;
  };
}

interface Venta {
  comisionReferente?: number;
}

const FormLayout: React.FC = () => {
  const [referidos, setReferidos] = useState<Afiliado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ventas, setVentas] = useState<{ [afiliadoId: string]: Venta[] }>({});

  const fetchReferidos = async () => {
    setLoading(true);
    try {
      const afiliadoID = localStorage.getItem("afiliado");
      const isAdmin = localStorage.getItem("admin");

      let querySnapshot;
      if (isAdmin) {
        // Si es admin, obtener todos los afiliados
        const afiliadosRef = collection(db, "afiliados");
        querySnapshot = await getDocs(afiliadosRef);
      } else if (afiliadoID) {
        // Si no es admin, obtener solo los referidos del afiliado
        const afiliadosRef = collection(db, "afiliados");
        const q = query(afiliadosRef, where("afiliadoReferente", "==", afiliadoID));
        querySnapshot = await getDocs(q);
      } else {
        console.error("No se encontró el ID del afiliado en localStorage");
        return;
      }

      // Mapeo de datos de afiliados
      const referidosList: Afiliado[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        email: doc.data().email,
        telefono: doc.data().telefono,
        fechaRegistro: doc.data().fechaRegistro,
      }));

      setReferidos(referidosList);

      // Obtener ventas por referido
      const ventasByReferido: { [afiliadoId: string]: Venta[] } = {};
      for (const referido of referidosList) {
        const ventasRef = collection(db, "afiliados", referido.id, "ventas");
        const ventasSnapshot = await getDocs(ventasRef);

        const ventasList: Venta[] = ventasSnapshot.docs.map((ventaDoc) => ({
          comisionReferente: ventaDoc.data().comisionReferente || 0,
        }));

        ventasByReferido[referido.id] = ventasList;
      }

      setVentas(ventasByReferido);
    } catch (error) {
      console.error("Error al obtener los referidos y ventas:", error);
    } finally {
      setLoading(false); // Establecer el estado de carga en falso
    }
  };

  useEffect(() => {
    fetchReferidos();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleCopyLink = () => {
    const afiliadoID = localStorage.getItem('afiliado');
    const link = `https://stocky.com.co/auth/signup?AFL=${afiliadoID}`;
    navigator.clipboard.writeText(link);
    alert('Enlace de referidos copiado al portapapeles');
  };

  const getTotalComision = (referidoId: string): number => {
    const ventasReferido = ventas[referidoId] || [];
    return ventasReferido.reduce((total, venta) => total + (venta.comisionReferente || 0), 0);
  };

  return (
    <div className="grid grid-cols-1 gap-9 p-4">
      <div className="flex items-center gap-4">
        <h2>
          Link para tus referidos: https://stocky.com.co/auth/signup?AFL=
          {localStorage.getItem('afiliado')}
        </h2>
        <button
          onClick={handleCopyLink}
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
          >
            <path d="M11 9 H20 A2 2 0 0 1 22 11 V20 A2 2 0 0 1 20 22 H11 A2 2 0 0 1 9 20 V11 A2 2 0 0 1 11 9 z" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-9">
        <div className="rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Teléfono</th>
                  <th className="py-2 px-4">Fecha de Registro</th>
                  <th className="py-2 px-4">Total Comisión</th>
                </tr>
              </thead>
              <tbody>
                {referidos.length > 0 ? (
                  referidos.map((referido) => (
                    <tr key={referido.id} className="text-center">
                      <td className="py-2 px-4">{referido.nombre}</td>
                      <td className="py-2 px-4">{referido.email}</td>
                      <td className="py-2 px-4">{referido.telefono}</td>
                      <td className="py-2 px-4">
                        {new Date(referido.fechaRegistro.seconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        {getTotalComision(referido.id)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-4" colSpan={5}>
                      No se encontraron referidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
