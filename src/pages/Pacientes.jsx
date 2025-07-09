import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import FilterPanel from "../components/Patients/FilterPanel";
import PatientCard from "../components/Patients/PatientCard";
import Pagination from "../components/Patients/Pagination";
import RecipeModal from "../components/modal/RecipeModal";
import AddPatientModal from "../components/modal/AddPatientModal";
import { useNavigate } from "react-router-dom";
import { debounce } from "../utils/debounce";
const API_URL = import.meta.env.VITE_URL;
export default function Pacientes({ onLogout, user }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 9;
  const navigate = useNavigate();

  function buildUrl() {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", perPage);

    params.append("minAge", filters.minAge ?? 0);
    params.append("maxAge", filters.maxAge ?? 0);

    if (typeof filters.name === "string" && filters.name.trim()) {
      params.append("name", filters.name.trim());
    }

    if (typeof filters.gender === "string" && filters.gender.trim()) {
      params.append("gender", filters.gender.trim());
    }

    const url = `${API_URL}/api/patient?${params.toString()}`;
    console.log("🔍 URL generada:", url);
    return url;
  }


  // Al inicio, cargar todos los pacientes una sola vez
  useEffect(() => {
    fetch(`${API_URL}/api/patient?page=1&limit=10000`, {
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
        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.patient_id,
          fullName: p.full_name,
          age: p.age,
          gender: p.gender === "M" ? "Masculino" : "Femenino",
          lastVisit: "Hace poco",
        }));
        setAllPatients(mapped);
        setPatients(mapped);
      })
      .catch((err) => {
        console.error("Error al cargar pacientes:", err);
      });
  }, []);

  const handleCreatePatient = (newPatient) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    fetch(`${API_URL}/api/patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatient),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar paciente");
        return res.json();
      })
      .then((data) => {
        alert("Paciente registrado con éxito");
        setPage(1);
        setFilters({});
        setShowModal(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Hubo un error al guardar");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleApplyFilters = (data) => {
    console.log("🧪 Filtros aplicados:", data);
    setFilters({
      minAge: data.minAge ?? 0,
      maxAge: data.maxAge ?? 0,
      name: data.name ?? "",
      gender: data.gender ?? "",
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    console.log("🧹 Filtros limpiados");
    setFilters({});
    setPage(1);
  };

  // Filtro local con debounce
  const debounceRef = useRef(debounce((value, all) => {
    const lower = value.toLowerCase();
    setPatients(
      all.filter(
        (p) =>
          p.fullName.toLowerCase().includes(lower) ||
          String(p.id).includes(lower)
      )
    );
  }, 400));

  const handleSearchInput = (value) => {
    setSearch(value);
    debounceRef.current(value, allPatients);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar onLogout={onLogout} />

        <main className="flex-1 p-8">
          <header className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Lista de Pacientes</h1>
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              <span className="material-symbols-outlined text-base text-xl">+</span>
              Agregar Paciente
            </button>
          </header>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Buscar por nombre / DNI / código del paciente
            </label>
            <input
              type="text"
              placeholder="Diego Alberto Salazar..."
              className="w-full border rounded p-2"
              value={search}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
          </div>

          <div className="flex gap-8">
            <FilterPanel
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />

            <section className="flex-1">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {patients.slice((page - 1) * perPage, page * perPage).map((p) => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    onView={() => navigate(`/paciente/${p.id}`)}
                  />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={Math.ceil(patients.length / perPage)}
                onChange={setPage}
              />
            </section>
          </div>
        </main>
      </div>

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePatient}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
