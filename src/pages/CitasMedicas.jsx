import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import AgregarCitaMedicaModal from "../components/modal/AgregarCitaMedicaModal";
const API_URL = import.meta.env.VITE_URL;
const horas = [
  "9 AM", "10 AM", "11 AM", "12 AM", "1 PM", "2 PM"
];
const horas24 = [9, 10, 11, 12, 13, 14];
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function toISODateString(date, hour = 0, min = 0, sec = 0) {
  const d = new Date(date);
  d.setHours(hour, min, sec, 0);
  return d.toISOString();
}

export default function CitasMedicas({ onLogout, user }) {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calcular los días de la semana actual
  const startOfWeek = getStartOfWeek(currentDate);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      nombre: diasSemana[d.getDay()],
      fecha: d.getDate(),
      mes: d.getMonth() + 1,
      year: d.getFullYear(),
      dayIndex: d.getDay(),
      fullDate: d,
    };
  });

  // Calcular rango de la semana en ISO8601
  const startISO = toISODateString(dias[0].fullDate, 0, 0, 0);
  const endISO = toISODateString(dias[6].fullDate, 23, 59, 59);

  const fetchAppointments = async () => {
    try {
      const url = `${API_URL}/api/medicalappointment?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`;
      const res = await fetch(url, {
        credentials: "include",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al cargar citas");
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [startISO, endISO]);

  // Construir un mapa para ubicar citas por fecha/hora
  const citasPorSlot = {};
  appointments.forEach((appt) => {
    // Usar start_time para ubicar la cita
    const timeStr = appt.start_time || appt.appointment_time || appt.appintment_time;
    if (!timeStr) return;
    const date = new Date(timeStr);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const hour = date.getHours();
    const key = `${y}-${m}-${d}-${hour}`;
    citasPorSlot[key] = appt;
  });

  // Cambiar semana
  const changeWeek = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset * 7);
    setCurrentDate(newDate);
  };

  // Volver a la semana actual
  const goToToday = () => setCurrentDate(new Date());

  // Encabezado dinámico
  const mesAnio = dias[0].fullDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^./, str => str.toUpperCase());

  return (
    <div className="flex min-h-screen bg-[#232126]">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 bg-[#f3f3f7] rounded-r-xl  ml-0 px-10 py-8 flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Citas Médicas</h1>
          <button
            className="bg-[#35727b] text-white rounded-lg px-5 py-2 text-[15px]"
            onClick={() => setShowModal(true)}
          >
            + Agregar Cita Médica
          </button>
        </header>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#35727b]">{mesAnio}</h2>
          <div className="flex gap-2">
            <button className="bg-[#35727b] text-white rounded px-3 py-1" onClick={() => changeWeek(-1)}>{'<'}</button>
            <button className="bg-[#35727b] text-white rounded px-3 py-1" onClick={goToToday}>Hoy</button>
            <button className="bg-[#35727b] text-white rounded px-3 py-1" onClick={() => changeWeek(1)}>{'>'}</button>
          </div>
        </div>
        {/* Mostrar citas de la semana seleccionada */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Citas de la semana</h3>
          {/* Si hay error, se registra en consola pero no se muestra al usuario */}
          {/* error && <div className="text-red-600 mb-2">{error}</div> */}
          {/* Lista de citas de la semana actual */}
          <ul className="divide-y divide-gray-300 bg-white rounded-lg shadow mb-4">
            {appointments.map((a) => {
              const timeStr = a.start_time || a.appointment_time || a.appintment_time;
              return (
                <li key={a.appointment_id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold text-[#35727b]">{timeStr ? new Date(timeStr).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  <span className="flex-1">Paciente: {a.patient_name}</span>
                  <span className="text-gray-700">Motivo: {a.reason}</span>
                  <span className="text-xs text-gray-500">Doctor: {a.doctor_name}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-row gap-3">
          {/* Horas */}
          <div className="flex flex-col gap-5 mt-10 mr-2">
            {horas.map((hora) => (
              <div key={hora} className="h-16 flex items-center text-[#a0a0a0] text-base font-medium">{hora}</div>
            ))}
          </div>
          {/* Días y slots con citas */}
          {dias.map((dia) => (
            <div key={dia.nombre + dia.fecha} className="flex flex-col gap-3 flex-1">
              <div className="text-center font-bold text-[#35727b] mb-2">{dia.nombre} {dia.fecha}</div>
              {horas24.map((h, i) => {
                const key = `${dia.year}-${dia.mes}-${dia.fecha}-${h}`;
                const appt = citasPorSlot[key];
                const timeStr = appt ? (appt.start_time || appt.appointment_time || appt.appintment_time) : null;
                return (
                  <div key={h + i} className={`rounded-lg h-16 mb-0.5 flex items-center px-2 ${appt ? 'bg-green-400 text-white font-semibold' : 'bg-[#35727b]'}`}>
                    {appt ? (
                      <div>
                        <div>{appt.patient_name}</div>
                        <div className="text-xs">{appt.reason}</div>
                        <div className="text-xs">{timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {showModal && (
          <AgregarCitaMedicaModal 
            onClose={() => setShowModal(false)} 
            onCreated={fetchAppointments}
            user={user}
          />
        )}
      </main>
    </div>
  );
} 