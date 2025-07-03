import { useState } from "react";
const API_URL = import.meta.env.VITE_URL;
export default function AddPatientModal({ onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      dni: form.dni,
      birth_date: new Date(form.birthDate).toISOString(),
      gender: form.gender,
      address: form.address,
      phone: form.phone,
      email: form.email,
      photo_url: "default",
    };

    console.log("📦 Datos a enviar:", payload);
    onSubmit(payload); // solo enviar datos al padre
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"></div>

      <div className="relative bg-white p-8 rounded w-[600px] shadow-lg animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">Agregar Paciente</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Documento</label>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="DNI..."
            />
          </div>
          <div className="flex items-end">
            <button className="bg-teal-700 text-white px-4 py-2 rounded w-full">
              Buscar Información
            </button>
          </div>

          <div>
            <label>Nombres</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Nombres..."
            />
          </div>
          <div>
            <label>Apellidos</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Apellidos..."
            />
          </div>

          <div>
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Género</label>
            <div className="flex gap-4 mt-2">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={form.gender === "M"}
                  onChange={handleChange}
                />{" "}
                Masculino
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={form.gender === "F"}
                  onChange={handleChange}
                />{" "}
                Femenino
              </label>
            </div>
          </div>

          <div>
            <label>Dirección</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Dirección..."
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Teléfono..."
            />
          </div>

          <div className="col-span-2">
            <label>Correo</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Correo..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
