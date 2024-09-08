"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Importa la configuración de Firebase
import { collection, getDocs } from "firebase/firestore";

interface Producto {
  url: string;
  nombre: string;
  precio: number;
  imagen: string;
  comision: number;
}

const copyToClipboard = (text: any) => {
  navigator.clipboard.writeText(text).then(
    () => alert('Enlace copiado al portapapeles!'),
    (err) => console.error('Error al copiar al portapapeles: ', err)
  );
};

const FormLayout = () => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const productsData: Producto[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Producto, 'id'>
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
                    Link
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comision
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                </tr>
              </thead>
              <tbody className="rounded-sm border border-stroke bg-white shadow-default p-4 dark:border-strokedark dark:bg-boxdark">
                {products.map((product) => (
                  <tr key={product.url}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                      <a href={`${product.url}?afiliado=${localStorage.getItem('afiliado')}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer">
                        {product.url}
                      </a>
                      <button
                        onClick={() => copyToClipboard(`${product.url}?afiliado=${localStorage.getItem('afiliado')}`)}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 0H5C3.34315 0 2 1.34315 2 3V19C2 20.6569 3.34315 22 5 22H15C16.6569 22 18 20.6569 18 19V3C18 1.34315 16.6569 0 15 0ZM16 19C16 19.5304 15.7893 20.0391 15.4142 20.4142C15.0391 20.7893 14.5304 21 14 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21071 5.46957 3 6 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V19ZM6 6H14V18H6V6ZM12 8H8V10H12V8ZM12 12H8V14H12V12ZM12 16H8V18H12V16Z" fill="currentColor" />
                        </svg>

                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {product.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${product.precio} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${product.comision} 
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
