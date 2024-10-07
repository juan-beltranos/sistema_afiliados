"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Producto {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  short_description: string;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => alert("Enlace copiado al portapapeles!"),
    (err) => console.error("Error al copiar al portapapeles: ", err)
  );
};

const FormLayout = () => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ms-public-api.rocketfy.com/rocketfy/api/v1/products",
          {
            headers: {
              "x-api-key": "OhnnILQdYFQjaePagghzG7EKnIcSt7qjgYD3Qa0bbG0=",
              "x-secret":
                "b7e49cfa3db4dfe8ebae7cd052996011713f186e5fa51bb706c574bf08aa922a3b20015ffb594c68281b72df3e3d9f7f25651283042e72da2cdcead1eb84b185.f71dddc43729ad31",
            },
          }
        );

        const productsData = response.data.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url || "",
          short_description: product.short_description || "",
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const generateProductUrl = (productId: string) => {
    const baseUrl = "http://stockyproducto.stocky.com.co";
    const url = new URL(baseUrl);
    url.searchParams.append("PRO", productId);
    url.searchParams.append("AFL", localStorage.getItem("afiliado") || "");

    return url.toString();
  };

  useEffect(() => {
    const logout = () => {
      if (!localStorage.getItem("afiliado") || localStorage.getItem("afiliado") === "") {
        window.location.href = "/auth/signin";
      }
    };

    logout();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-100 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-500 mb-4">Precio: ${product.price}</p>
            <p className="text-gray-500 mb-4">Descripción: ${product.short_description}</p>

            <div className="flex items-center space-x-4">
              <a
                href={generateProductUrl(product.id)}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pagina de venta
              </a>
              <button
                onClick={() => copyToClipboard(generateProductUrl(product.id))}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg mt-5"
            >
              <a href={generateProductUrl(product.id)} className="hover:underline text-white" target="_blank" rel="noopener noreferrer">
                Ver Producto
              </a>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormLayout;
