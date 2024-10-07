"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

interface Venta {
  email: string;
  state: string;
  comisionAfiliado: number;
  comisionReferente: number;
  totalAmount: number;
  lastName: string;
  date: string;
  courrier: string;
  note: string;
  name: string;
  affiliate_id: string;
  destinationBilling: {
    neighborhood: string;
    phone: string;
    city: string;
    address: string;
    department: string;
  };
  confirm: boolean;
  products: {
    price: number;
    quantity: number;
    identifier: string;
  }[];
}

const FormLayout = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasGeneradas, setVentasGeneradas] = useState(0);
  const [comisionAcumulada, setComisionAcumulada] = useState(0);
  const [comisionSubafiliados, setComisionSubafiliados] = useState(0);

  useEffect(() => {
    const fetchVentasYComisiones = async () => {
      const idAfiliado = localStorage.getItem('afiliado');
      if (!idAfiliado) {
        console.error("No se encontró el ID del afiliado");
        return;
      }

      try {
        // Consulta para obtener las ventas del afiliado
        const ventasRef = collection(db, 'afiliados', idAfiliado, 'ventas');
        const ventasSnapshot = await getDocs(ventasRef);

        let totalVentas = 0;
        let totalComisionAcumulada = 0;
        const ventasData: Venta[] = [];

        ventasSnapshot.forEach((doc) => {
          const ventaData = doc.data() as Venta;
          ventasData.push(ventaData);
          totalVentas += ventaData.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
          totalComisionAcumulada += ventaData.comisionAfiliado;
        });

        // Obtener la información del afiliado
        const afiliadoDocRef = doc(db, 'afiliados', idAfiliado);
        const afiliadoDoc = await getDoc(afiliadoDocRef);

        if (afiliadoDoc.exists()) {
          const afiliadoData = afiliadoDoc.data();
          const comisionAfiliado = afiliadoData?.comisionAcumulada || 0;
          const comisionSubafiliados = afiliadoData?.comisionSubafiliados || 0;

          // Actualizar el estado
          setVentas(ventasData);
          setVentasGeneradas(totalVentas);
          setComisionAcumulada(comisionAfiliado);
          setComisionSubafiliados(comisionSubafiliados);
        } else {
          console.error("No se encontró el documento del afiliado");
        }

      } catch (error) {
        console.error("Error al obtener las ventas y comisiones:", error);
      }
    };

    fetchVentasYComisiones();
  }, []);

  const logout = () => {
    if (!localStorage.getItem('afiliado') || localStorage.getItem('afiliado') === '') {
      window.location.href = '/auth/signin';
    }
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-9 p-4">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
          <h2 className="text-lg font-semibold mb-4">Resumen de Ventas</h2>
          <p><strong>Total de Ventas Propias:</strong> {ventasGeneradas}</p>
          <p><strong>Comisión Ventas:</strong> ${comisionAcumulada}</p>
          <p><strong>Comisión Afiliados:</strong> ${comisionSubafiliados}</p>
          <p><strong>Comisión Acumulada:</strong> ${comisionSubafiliados + comisionAcumulada}</p>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
