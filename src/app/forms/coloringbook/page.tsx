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
  comisionReferente?: number; // Asegurarse de usar el nombre correcto
}

const FormLayout: React.FC = () => {
  const [referidos, setReferidos] = useState<Afiliado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ventas, setVentas] = useState<{ [afiliadoId: string]: Venta[] }>({});

  const fetchReferidos = async () => {
    try {
      const afiliadoID = localStorage.getItem('afiliado');
      if (!afiliadoID) {
        console.error('No afiliado ID found in localStorage');
        return;
      }

      // 1. Consultar Firebase para obtener todos los referidos cuyo afiliadoReferente sea igual al afiliadoID
      const afiliadosRef = collection(db, 'afiliados');
      const q = query(afiliadosRef, where('afiliadoReferente', '==', afiliadoID));
      const querySnapshot = await getDocs(q);

      // 2. Obtener los datos de los referidos y guardarlos en el estado
      const referidosList: Afiliado[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        email: doc.data().email,
        telefono: doc.data().telefono,
        fechaRegistro: doc.data().fechaRegistro,
      }));

      setReferidos(referidosList);

      // 3. Obtener la subcolección 'ventas' para cada referido
      const ventasByReferido: { [afiliadoId: string]: Venta[] } = {};
      for (const referido of referidosList) {
        const ventasRef = collection(db, 'afiliados', referido.id, 'ventas');
        const ventasSnapshot = await getDocs(ventasRef);

        const ventasList: Venta[] = ventasSnapshot.docs.map((ventaDoc) => {
          return { comisionReferente: ventaDoc.data().comisionReferente || 0 };
        });

        ventasByReferido[referido.id] = ventasList;
      }

      setVentas(ventasByReferido);
    } catch (error) {
      console.error('Error al obtener los referidos y ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferidos();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Función para calcular la suma de comisiones de cada referido
  const getTotalComision = (referidoId: string): number => {
    const ventasReferido = ventas[referidoId] || [];
    return ventasReferido.reduce((total, venta) => total + (venta.comisionReferente || 0), 0);
  };

  return (
    <div className="grid grid-cols-1 gap-9 p-4">
      <h2>
        Link para tus referidos: stockyafiliados.stocky.com.co/auth/signup?AFL=
        {localStorage.getItem('afiliado')}
      </h2>

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
                        {getTotalComision(referido.id)} {/* Muestra la suma de comisiones */}
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
