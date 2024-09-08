"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Asegúrate de tener la configuración de Firebase correcta
import { collection, getDocs, DocumentData } from "firebase/firestore";

// Define la interfaz para una venta
interface Venta {
  id: string;
  cantidad: number;
  comisión: number;
  fecha: Date;
  urlProducto: string;
  valorVenta: number;
}

const FormLayout: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]); // Estado con el tipo correcto
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
          comisión: doc.data().comisión,
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

  if (loading) {
    return <p>Cargando ventas...</p>;
  }

  if (ventas.length === 0) {
    return <p>No se encontraron ventas para este afiliado.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
         
          <div className="">
            {ventas.map((venta) => (
              <div key={venta.id} className="rounded-sm border border-stroke bg-white shadow-default p-4 dark:border-strokedark dark:bg-boxdark">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <strong>ID Venta:</strong> {venta.id}
                </p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <strong>Cantidad:</strong> {venta.cantidad}
                </p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <strong>Comisión:</strong> {venta.comisión}
                </p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <strong>Fecha:</strong> {venta.fecha.toLocaleDateString()}
                </p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <strong>URL Producto: </strong>
                  <a href={venta.urlProducto} target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all">
                    {venta.urlProducto}
                  </a>
                </p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  <strong>Valor Venta:</strong> {venta.valorVenta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default FormLayout;
