// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold text-white mb-4">
        404 - Página no encontrada
      </h1>
      <p className="text-xs text-white  mb-14">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link to="/" className="px-6 py-2 text-sm bg-white text-one font-semibold rounded">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
