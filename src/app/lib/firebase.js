import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBmnUB4mhZoM9iugu-GrfnfXi1-LwrLP7I",
    authDomain: "stocky-afiliados.firebaseapp.com",
    projectId: "stocky-afiliados",
    storageBucket: "stocky-afiliados.appspot.com",
    messagingSenderId: "956724532974",
    appId: "1:956724532974:web:2ce7cab2141e4c807a45ff",
    measurementId: "G-ELFRKVQ7W9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
