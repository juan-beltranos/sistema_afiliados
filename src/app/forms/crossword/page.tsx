"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Asegúrate de tener la configuración de Firebase correcta
import { collection, getDocs, DocumentData } from "firebase/firestore";

// Define la interfaz para una venta
interface Venta {
  id: string;
  cantidad: number;
  comision: number;
  fecha: Date;
  urlProducto: string;
  valorVenta: number;
}

const FormLayout: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        // Obtener el id del afiliado desde localStorage
        const idAfiliado = localStorage.getItem("afiliado");

        if (!idAfiliado) {
          console.error("No se encontró el ID del afiliado en localStorage");
          setLoading(false);
          return;
        }

        const ventasRef = collection(db, "afiliados", idAfiliado, "ventas");

        const ventasSnapshot = await getDocs(ventasRef);

        // Mapeamos las ventas a un array
        const ventasList: Venta[] = ventasSnapshot.docs.map((doc: DocumentData) => ({
          id: doc.id,
          cantidad: doc.data().cantidad,
          comision: doc.data().comisionAfiliado,
          fecha: doc.data().fecha.toDate(),
          urlProducto: doc.data().urlProducto,
          valorVenta: doc.data().valorVenta,
        }));

        setVentas(ventasList);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);
  
  const logout = () => {
    if (!localStorage.getItem('afiliado') || localStorage.getItem('afiliado') === '') {
      window.location.href = '/auth/signin'
    }
  };

  useEffect(() => {
    logout()
  }, [])


  if (loading) {
    return <p>Cargando ventas...</p>;
  }

  if (ventas.length === 0) {
    return <p>No se encontraron ventas para este afiliado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {ventas.map((venta) => (
        <div key={venta.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4">
            <p className="text-lg font-bold text-black mb-2 dark:text-black">
              <strong>ID Venta:</strong> {venta.id}
            </p>
            <p className="text-lg text-gray-700 dark:text-black mb-2">
              <strong>Cantidad:</strong> {venta.cantidad}
            </p>
            <p className="text-lg text-gray-700 dark:text-black mb-2">
              <strong>Comisión:</strong> ${venta.comision}
            </p>
            <p className="text-lg text-gray-700 dark:text-black mb-2">
              <strong>Fecha:</strong> {venta.fecha.toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-700 dark:text-black mb-2 break-all">
              <strong>URL Producto:</strong>
              <a
                href={venta.urlProducto}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline">
                {venta.urlProducto}
              </a>
            </p>
            <p className="text-lg text-gray-700 dark:text-black">
              <strong>Valor Venta:</strong> ${venta.valorVenta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormLayout;
