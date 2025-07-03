import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Recetas from "./pages/Recetas";
import InfoPaciente from "./pages/InfoPaciente";
import CitasMedicas from "./pages/CitasMedicas";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData); 
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
      <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      <Route path="/pacientes" element={<Pacientes user={user} onLogout={handleLogout} />} />
      <Route path="/paciente/:id" element={<InfoPaciente user={user} onLogout={handleLogout} />} />
      <Route path="/recetas" element={<Recetas user={user} onLogout={handleLogout} />} />
      <Route path="/citas" element={<CitasMedicas user={user} onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;