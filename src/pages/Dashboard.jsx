import { useEffect, useState } from "react";
import PropTypes from "prop-types";
const API_URL = import.meta.env.VITE_URL;
// Componentes UI
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import AppointmentsTimeline from "../components/Appointments/AppointmentsTimeline";
import QuickActions from "../components/QuickActions/QuickActions";

export default function Dashboard({ user, onLogout, onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Alerta de Cita Médica",
      body: "Lorem viverra urna. elit. tortor. ex ipsum sollicitudin. nec elit. tincidunt lorem. ex placerat. Ut id ...",
    },
    {
      id: 2,
      title: "Recordatorio de Examen",
      body: "Lorem viverra urna. elit. tortor. ex ipsum sollicitudin. nec elit. tincidunt lorem. ex placerat. Ut id ...",
    },
    {
      id: 3,
      title: "Nueva Cita Programada",
      body: "Lorem viverra urna. elit. tortor. ex ipsum sollicitudin. nec elit. tincidunt lorem. ex placerat. Ut id ...",
    },
  ]);
  const [fadingOut, setFadingOut] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/medicalappointment/today`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error ${res.status}: ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.appointment_id,
          time: new Date(item.appintment_time).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          patient: item.patient_name,
          status: item.status,
          reason: item.reason,
        }));
        setAppointments(mapped);
      })
      .catch((err) => {
        console.error("Error cargando citas:", err);
      });
  }, []);

  const handleAcceptNotification = (id) => {
    setFadingOut((prev) => [...prev, id]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setFadingOut((prev) => prev.filter((f) => f !== id));
    }, 500);
  };

  const handleCreatePrescription = () => {
    console.log("Crear receta");
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 p-6 overflow-y-auto">
        <TopBar user={user} onNavigate={onNavigate} />

        <div className="flex flex-wrap gap-12">
          <AppointmentsTimeline date={new Date()} appointments={appointments} />

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-4">Notificaciones</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No hay notificaciones.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 rounded-lg p-4 mb-4 bg-teal-700 text-white shadow transition-opacity duration-500 ${
                    fadingOut.includes(n.id) ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {/* Icono */}
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
                      />
                    </svg>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{n.title}</h4>
                    <p className="text-sm text-white/90">{n.body}</p>
                  </div>

                  {/* Botón */}
                  <div className="mt-2">
                    <button
                      onClick={() => handleAcceptNotification(n.id)}
                      className="px-4 py-2 bg-white text-teal-700 font-semibold rounded hover:bg-gray-100 transition"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12">
          <QuickActions onCreatePrescription={handleCreatePrescription} />
        </div>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
