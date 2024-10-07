"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Asegúrate de tener la configuración de Firebase correcta
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// Define la interfaz para una venta
interface Producto {
  identifier: string;
  price: string;
  quantity: number;
}

interface DestinationBilling {
  address: string;
  department: string;
  city: string;
  phone: string;
  neighborhood: string;
}

interface Venta {
  id: string;
  name: string;
  lastName: string;
  email: string;
  confirm: boolean;
  note?: string;
  courrier: string;
  products: Producto[];
  destinationBilling: DestinationBilling;
}

const FormLayout: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const isAdmin = localStorage.getItem("admin");
        const idAfiliado = localStorage.getItem("afiliado");

        if (isAdmin) {
          const ventasRef = collection(db, "ventas"); 
          const ventasSnapshot = await getDocs(ventasRef);
          const ventasList = ventasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Venta[];

          setVentas(ventasList);
        } else if (idAfiliado) {
          // Si no es admin, consulta la subcolección de ventas del afiliado
          const ventasRef = collection(db, "afiliados", idAfiliado, "ventas");
          const ventasSnapshot = await getDocs(ventasRef);

          const ventasList = ventasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Venta[];

          setVentas(ventasList);
        } else {
          console.error("No se encontró el ID del afiliado en localStorage");
        }
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    const logout = () => {
      if (!localStorage.getItem("afiliado") || localStorage.getItem("afiliado") === "") {
        window.location.href = "/auth/signin";
      }
    };
    logout();
  }, []);

  const confirmarVenta = async (ventaId: string) => {
    try {
      const idAfiliado = localStorage.getItem("afiliado");
      if (!idAfiliado) {
        console.error("No se encontró el ID del afiliado en localStorage");
        return;
      }

      // Referencia a la subcolección "ventas" dentro del afiliado
      const ventaRefAfiliado = doc(db, "afiliados", idAfiliado, "ventas", ventaId);
      const ventaRefGeneral = doc(db, "ventas", ventaId);

      // Actualizar la subcolección de ventas del afiliado
      await updateDoc(ventaRefAfiliado, {
        confirm: true,
      });

      // Actualizar la colección general de ventas
      await updateDoc(ventaRefGeneral, {
        confirm: true,
      });

      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaId ? { ...venta, confirm: true } : venta
        )
      );

      console.log(`Venta ${ventaId} confirmada exitosamente en ambas colecciones.`);
    } catch (error) {
      console.error("Error al confirmar la venta:", error);
    }
  };

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
          {/* Detalles de la Venta */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Detalles de la Venta</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Id Venta:</strong> {venta.id}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Cliente:</strong> {venta.name} {venta.lastName}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Email:</strong> {venta.email}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Nota:</strong> {venta.note || "Sin nota"}
            </p>
          </div>

          {/* Detalles del Producto */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Detalles del Producto</h2>
            {venta.products.map((product, index) => (
              <div key={index} className="mb-2">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Producto ID:</strong> {product.identifier}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Precio:</strong> ${product.price}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Cantidad:</strong> {product.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Información de Facturación */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Información de Facturación</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Dirección:</strong> {venta.destinationBilling.address}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Departamento:</strong> {venta.destinationBilling.department}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Ciudad:</strong> {venta.destinationBilling.city}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Teléfono:</strong> {venta.destinationBilling.phone}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Barrio:</strong> {venta.destinationBilling.neighborhood}
            </p>
          </div>

          <div className="flex gap-4">
            <button>Ver Detalle</button>
            <button
              onClick={() => confirmarVenta(venta.id)}
              disabled={venta.confirm}
              className={`px-4 py-2 rounded-md text-white ${venta.confirm ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {venta.confirm ? 'Pedido Confirmado' : 'Confirmar Venta'}
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default FormLayout;
