import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Pagination from "../components/Patients/Pagination";
import RecipeModal from "../components/modal/RecipeModal";
import RecipeCard from "../components/recipe/RecipeCard";
const API_URL = import.meta.env.VITE_URL;
export default function Recetas({ onLogout, user }) {
  const [showModal, setShowModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const perPage = 6;

  const fetchPrescriptions = () => {
    fetch(`${API_URL}/api/prescription`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((r) => ({
          id: r.prescription_id,
          patientName: r.patient_name,
          patientDni: r.patient_dni,
          issuedAt: r.issued_at,
          items: r.items,
        }));
        setPrescriptions(mapped);
      })
      .catch((err) => {
        console.error("Error al cargar recetas:", err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleCreatePrescription = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/prescription`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la receta');
      }

      alert("Receta creada exitosamente");
      setShowModal(false);
      fetchPrescriptions();
    } catch (err) {
      console.error("Error al crear receta:", err);
      alert(err.message || "Error al crear la receta");
    }
  };

  const totalPages = Math.ceil(prescriptions.length / perPage);
  const paginated = prescriptions.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Lista de Recetas</h1>
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              <span className="material-symbols-outlined text-base text-xl">+</span>
              Agregar Receta
            </button>
          </header>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {/* buscador (pendiente de implementar lógica) */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Buscar por nombre / DNI / código del paciente
            </label>
            <input
              type="text"
              placeholder="Diego Alberto Salazar..."
              className="w-full border rounded p-2"
            />
          </div>
          {/* tarjetas de recetas */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((r) => (
              <RecipeCard key={r.id} prescription={r} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </main>
      </div>
      {/* Modal para agregar receta */}
      {showModal && (
        <RecipeModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePrescription}
          user={user}
        />
      )}
    </>
  );
}
