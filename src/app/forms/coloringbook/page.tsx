"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Importa la configuración de Firebase
import { collection, getDocs } from "firebase/firestore";

interface Producto {
  url: string;
  nombre: string;
  precio: number;
  imagen: string;
}


const FormLayout = () => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos")); // Reemplaza "products" con el nombre de tu colección
        const productsData: Producto[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Producto, 'id'> // Asegúrate de que los datos coincidan con la interfaz
        }));
        console.log(productsData);

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-9 p-4">
      <div className="flex flex-col gap-9">
        <div className="rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.url}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <a href={`${product.url}?afiliado=${localStorage.getItem('afiliado')}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer">
                        Ver Producto
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {product.nombre} {/* Asumiendo que tienes un campo `nombre` */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${product.precio} {/* Asumiendo que tienes un campo `precio` */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
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
