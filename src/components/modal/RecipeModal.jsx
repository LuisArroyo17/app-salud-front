import { useState } from "react";

export default function RecipeModal({ onClose, onSubmit, user }) {
  const [form, setForm] = useState({
    patientId: "",
    prescriptionObservations: "",
    items: [
      {
        medication: "",
        dosage: "",
        frequency: "",
        duration_days: "",
        administration_route: "",
        observations: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleItemChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const items = prev.items.map((item, i) =>
        i === idx ? { ...item, [name]: value } : item
      );
      return { ...prev, items };
    });
    setError(null);
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medication: "",
          dosage: "",
          frequency: "",
          duration_days: "",
          administration_route: "",
          observations: "",
        },
      ],
    }));
  };

  const removeItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async () => {
    if (!form.patientId || form.items.some(item => !item.medication || !item.dosage || !item.frequency || !item.duration_days || !item.administration_route)) {
      setError("Por favor complete todos los campos requeridos en cada medicamento");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = {
        electronic_signature: user?.fullName || "Dr. Desconocido",
        patient_id: parseInt(form.patientId),
        observations: form.prescriptionObservations,
        items: form.items.map(item => ({
          medication: item.medication,
          dosage: item.dosage,
          frequency: item.frequency,
          duration_days: parseInt(item.duration_days),
          administration_route: item.administration_route,
          observations: item.observations,
        })),
      };
      await onSubmit(data);
    } catch (err) {
      setError(err.message || "Error al crear la receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"></div>
      <div className="relative bg-white p-8 rounded w-[700px] shadow-lg animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Agregar Receta Médica</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1">ID del Paciente *</label>
          <input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            placeholder="1"
            className="w-full border p-2 rounded"
            type="number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Observaciones generales de la receta</label>
          <textarea
            name="prescriptionObservations"
            value={form.prescriptionObservations}
            onChange={handleChange}
            placeholder="Observaciones generales de la receta"
            className="w-full border p-2 rounded h-16"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Medicamentos</h3>
          {form.items.map((item, idx) => (
            <div key={idx} className="border rounded p-4 mb-4 relative bg-gray-50">
              {form.items.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-600 font-bold text-lg"
                  onClick={() => removeItem(idx)}
                  title="Eliminar este medicamento"
                >
                  ×
                </button>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Medicamento *</label>
                  <input
                    name="medication"
                    value={item.medication}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="Paracetamol"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Dosis *</label>
                  <input
                    name="dosage"
                    value={item.dosage}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="500 mg"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">Frecuencia *</label>
                  <input
                    name="frequency"
                    value={item.frequency}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="Cada 8 horas"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Días de duración *</label>
                  <input
                    name="duration_days"
                    value={item.duration_days}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="7"
                    className="w-full border p-2 rounded"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Vía de administración *</label>
                  <input
                    name="administration_route"
                    value={item.administration_route}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="Oral"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">Observaciones del ítem</label>
                  <textarea
                    name="observations"
                    value={item.observations}
                    onChange={e => handleItemChange(idx, e)}
                    placeholder="Observaciones para el medicamento"
                    className="w-full border p-2 rounded h-16"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded font-semibold mt-2"
            onClick={addItem}
          >
            + Agregar medicamento
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
