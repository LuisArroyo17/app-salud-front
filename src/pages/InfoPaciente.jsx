import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_URL;
const TABS = [
  "Diagnósticos",
  "Tratamientos",
  "Resultados de laboratorios",
  "Vacunas",
  "Antecedentes",
];

export default function InfoPaciente({ onLogout, user }) {
  const [tab, setTab] = useState(0);
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/patient/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Error al cargar los datos del paciente');
        }
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/diagnosis/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Error al cargar diagnósticos');
        const data = await response.json();
        setDiagnoses(data);
      } catch (err) {
        console.error('Error cargando diagnósticos:', err);
      }
    };

    const fetchTreatments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/treatment/patient/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Error al cargar tratamientos');
        const data = await response.json();
        setTreatments(data);
      } catch (err) {
        console.error('Error cargando tratamientos:', err);
      }
    };

    const fetchLabResults = async () => {
      try {
        const response = await fetch(`${API_URL}/api/labresult/patient/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Error al cargar resultados de laboratorio');
        const data = await response.json();
        setLabResults(data);
      } catch (err) {
        console.error('Error cargando resultados de laboratorio:', err);
      }
    };

    const fetchVaccines = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vaccine/patient/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Error al cargar vacunas');
        const data = await response.json();
        setVaccines(data);
      } catch (err) {
        console.error('Error cargando vacunas:', err);
      }
    };

    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/medicalhistory/patient/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Error al cargar antecedentes médicos');
        const data = await response.json();
        setMedicalHistory(data);
      } catch (err) {
        console.error('Error cargando antecedentes médicos:', err);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPatientData(),
          fetchDiagnoses(),
          fetchTreatments(),
          fetchLabResults(),
          fetchVaccines(),
          fetchMedicalHistory()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#232126]">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 bg-[#f3f3f7] rounded-r-xl ml-0 px-10 py-8">
          <div className="flex items-center justify-center h-full">
            <p>Cargando datos del paciente...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#232126]">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 bg-[#f3f3f7] rounded-r-xl ml-0 px-10 py-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#232126]">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 bg-[#f3f3f7] rounded-r-xl ml-0 px-10 py-8 flex flex-col">
        {/* Botón volver */}
        <button
          className="mb-4 flex items-center gap-2 text-[#35727b] hover:underline w-fit"
          onClick={() => navigate("/pacientes")}
        >
          <span className="text-2xl">&#8592;</span> Volver
        </button>
        <div className="flex gap-8">
          {/* Card paciente */}
          <div className="bg-[#e9e9ee] rounded-xl p-8 w-80 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
            <div className="text-lg font-bold text-center mb-2">
              {patient?.last_name} {patient?.first_name}
            </div>
            <div className="text-sm mb-2"><b>Edad:</b> {patient?.age} años</div>
            <div className="text-sm mb-2"><b>DNI:</b> {patient?.patient_id}</div>
            <div className="text-sm font-semibold mt-4 mb-1">Contacto de emergencia</div>
            <div className="text-sm mb-1">📞 {patient?.phone}</div>
            <div className="text-sm mb-4">📍 {patient?.address}</div>
            <hr className="w-full my-2 border-gray-400" />
            <div className="text-sm font-semibold mt-2 mb-1">Alergias</div>
            <ul className="text-sm list-disc ml-5">
              <li>{patient?.allergy || "No registra alergias"}</li>
            </ul>
          </div>
          {/* Panel derecho */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-400 mb-4">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  className={`py-2 px-1 font-semibold border-b-2 transition-colors duration-200 ${tab === i ? "border-[#35727b] text-[#35727b]" : "border-transparent text-gray-700 hover:text-[#35727b]"}`}
                  onClick={() => setTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>
            {/* Contenido de cada tab */}
            <div className="flex-1">
              {tab === 0 && (
                <div>
                  {diagnoses.length === 0 ? (
                    <p className="text-gray-700">No hay diagnósticos registrados.</p>
                  ) : (
                    diagnoses.map((d, idx) => (
                      <div key={d.diagosis_id} className="flex items-start gap-4 mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 bg-[#35727b] rounded-full mt-2" />
                          {idx < diagnoses.length - 1 && (
                            <div className="w-1 bg-gray-400 flex-1" style={{ minHeight: 60 }} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-700 mb-1">{d.diagnosis_date}</div>
                          <div className="bg-[#ededf2] rounded-lg p-4">
                            <div className="font-bold mb-1">{d.description}</div>
                            <div className="text-sm text-gray-700">{d.observations}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <button className="mt-4 bg-[#35727b] text-white px-6 py-2 rounded font-semibold">
                    Agregar nuevo diagnóstico
                  </button>
                </div>
              )}
              {tab === 1 && (
                <div>
                  {treatments.length === 0 ? (
                    <p className="text-gray-700">No hay tratamientos registrados.</p>
                  ) : (
                    treatments.map((t) => (
                      <div key={t.treatment_id} className="bg-[#ededf2] rounded-lg p-4 mb-4">
                        <div className="font-bold mb-2">{t.Description}</div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Período:</span> {t.start_date} - {t.end_date}
                        </div>
                        <div className="text-sm text-gray-700">{t.observations}</div>
                      </div>
                    ))
                  )}
                  <button className="mt-4 bg-[#35727b] text-white px-6 py-2 rounded font-semibold">
                    Agregar nuevo tratamiento
                  </button>
                </div>
              )}
              {tab === 2 && (
                <div>
                  {labResults.length === 0 ? (
                    <p className="text-gray-700">No hay resultados de laboratorio registrados.</p>
                  ) : (
                    labResults.map((r) => (
                      <div key={r.lab_result_id} className="bg-[#ededf2] rounded-lg p-4 mb-4">
                        <div className="font-bold mb-2">{r.test_type}</div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Fecha de muestra:</span> {r.sample_date}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Resultado:</span> {r.result_value}
                        </div>
                        <div className="text-sm text-gray-700">{r.observations}</div>
                      </div>
                    ))
                  )}
                  <button className="mt-4 bg-[#35727b] text-white px-6 py-2 rounded font-semibold">
                    Agregar nuevo resultado
                  </button>
                </div>
              )}
              {tab === 3 && (
                <div>
                  {vaccines.length === 0 ? (
                    <p className="text-gray-700">No hay vacunas registradas.</p>
                  ) : (
                    vaccines.map((v) => (
                      <div key={v.vaccine_id} className="bg-[#ededf2] rounded-lg p-4 mb-4">
                        <div className="font-bold mb-2">{v.vaccine_type}</div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Fecha de administración:</span> {v.administered_on}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Dosis:</span> {v.dose}
                        </div>
                        <div className="text-sm text-gray-700">{v.observations}</div>
                      </div>
                    ))
                  )}
                  <button className="mt-4 bg-[#35727b] text-white px-6 py-2 rounded font-semibold">
                    Agregar nueva vacuna
                  </button>
                </div>
              )}
              {tab === 4 && (
                <div>
                  {medicalHistory.length === 0 ? (
                    <p className="text-gray-700">No hay antecedentes registrados.</p>
                  ) : (
                    medicalHistory.map((h) => (
                      <div key={h.medical_history_id} className="bg-[#ededf2] rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Fecha:</span> {h.recorded_at}
                        </div>
                        <div className="text-sm text-gray-700">{h.description}</div>
                      </div>
                    ))
                  )}
                  <button className="mt-4 bg-[#35727b] text-white px-6 py-2 rounded font-semibold">
                    Agregar nuevo antecedente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 