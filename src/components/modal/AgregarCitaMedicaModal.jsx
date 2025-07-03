import React, { useRef, useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_URL;
export default function AgregarCitaMedicaModal({ onClose, onCreated, user }) {
  const modalRef = useRef(null);
  const [form, setForm] = useState({
    patientId: "",
    date: "",
    time: "",
    duration: 30,
    reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.date || !form.time || !form.reason) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const localDate = new Date(`${form.date}T${form.time}`);
      const appointment_time = localDate.toISOString();
      const payload = {
        appointment_time,
        doctor_id: user?.id || 1, // Ajusta según tu sistema de usuarios
        duration_minutes: parseInt(form.duration),
        patient_id: parseInt(form.patientId),
        reason: form.reason
      };
      const res = await fetch(`${API_URL}/api/medicalappointment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Error al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-[#f3f3f7] rounded-xl shadow-lg p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8">Agregar Cita Médica</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
          <div>
            <label className="block font-semibold mb-1">ID Paciente *</label>
            <input name="patientId" className="w-full border rounded px-3 py-2" value={form.patientId} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Fecha *</label>
            <input name="date" type="date" className="w-full border rounded px-3 py-2" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Hora *</label>
            <input name="time" type="time" className="w-full border rounded px-3 py-2" value={form.time} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Duración (minutos)</label>
            <input name="duration" type="number" min="1" className="w-full border rounded px-3 py-2" value={form.duration} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Motivo *</label>
            <input name="reason" className="w-full border rounded px-3 py-2" value={form.reason} onChange={handleChange} required />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" className="flex-1 border border-gray-400 py-2 rounded" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="flex-1 bg-[#35727b] text-white py-2 rounded disabled:opacity-50" disabled={loading}>
              {loading ? "Guardando..." : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 