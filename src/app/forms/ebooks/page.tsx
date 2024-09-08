"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define el tipo para los datos de una venta
interface Venta {
  cantidad: number;
  comisión: number;
  fecha: {
    seconds: number;
    nanoseconds: number;
  };
  urlProducto: string;
  valorVenta: number;
}

const FormLayout = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasGeneradas, setVentasGeneradas] = useState(0);
  const [comisionAcumulada, setComisionAcumulada] = useState(0);

  useEffect(() => {
    const fetchVentas = async () => {
      const idAfiliado = localStorage.getItem('afiliado');
      if (!idAfiliado) {
        console.error("No se encontró el ID del afiliado");
        return;
      }

      try {
        const ventasRef = collection(db, 'afiliados', idAfiliado, 'ventas');
        const ventasSnapshot = await getDocs(ventasRef);

        let totalVentas = 0;
        let totalComision = 0;
        const ventasData: Venta[] = [];

        ventasSnapshot.forEach((doc) => {
          const ventaData = doc.data() as Venta;
          ventasData.push(ventaData);
          totalVentas += ventaData.cantidad;
          totalComision += ventaData.comisión;
        });

        setVentas(ventasData);
        setVentasGeneradas(totalVentas);
        setComisionAcumulada(totalComision);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    fetchVentas();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-9 p-4">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
          <h2 className="text-lg font-semibold mb-4">Resumen de Ventas</h2>
          <p><strong>Total de Ventas:</strong> {ventasGeneradas}</p>
          <p><strong>Comisión Acumulada:</strong> ${comisionAcumulada}</p>

          <h3 className="text-md font-semibold mt-4">Detalle de Ventas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Venta</th>
                </tr>
              </thead>
              <tbody className="rounded-sm border border-stroke bg-white shadow-default p-4 dark:border-strokedark dark:bg-boxdark">
                {ventas.map((venta, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(venta.fecha.seconds * 1000).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{venta.cantidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${venta.comisión}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${venta.valorVenta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
