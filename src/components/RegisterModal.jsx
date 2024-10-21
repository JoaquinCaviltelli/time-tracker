import { useState } from "react";

const RegisterModal = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    onRegister(name, email, password); // Pasa el nombre, correo y contraseña al método de registro
  };

  if (!isOpen) return null; // Si el modal no está abierto, no se muestra

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Registrarse</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Ingresa tu nombre"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Ingresa tu correo"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-one text-white rounded-md"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
