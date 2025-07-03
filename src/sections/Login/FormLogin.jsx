import InputLogin from "../../components/Login/InputLogin";
import UserIcon from "../../Icons/UserIcon";
import { useState } from "react";
const API_URL = import.meta.env.VITE_URL;
export default function FormLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username, password })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error en la respuesta del servidor');
      }

      const data = await res.json();
      setResponseMessage(`Login exitoso. Usuario: ${data.email}`);
      onLogin(data); // Llama a onLogin para actualizar el estado global
    } catch (err) {
      setResponseMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="border-solid border-2 border-white rounded-full p-4 mb-6">
        <UserIcon className={"size-28 text-white"} />
      </div>
      <form
        className="flex gap-4 flex-col justify-center items-center p-6 rounded  w-72"
        onSubmit={handleLogin}
      >
        <InputLogin
          placeholder={"Username"}
          type={"text"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputLogin
          placeholder={"Password"}
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {responseMessage && (
          <div className="text-red-500 text-sm w-full text-center">{responseMessage}</div>
        )}
        <button
          className="bg-white w-full rounded-lg h-10 font-bold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}