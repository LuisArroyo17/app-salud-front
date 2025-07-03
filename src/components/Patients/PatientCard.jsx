export default function PatientCard({ patient, onView }) {
  return (
    <div className="bg-primary text-white p-4 rounded shadow flex flex-col gap-2">
      <h4 className="font-semibold leading-tight">
        {patient.fullName}
      </h4>
      <p className="text-sm">
        {patient.age} años / {patient.gender}
      </p>
      <p className="text-sm flex items-center gap-1">
        <span className="material-symbols-outlined text-base">
          schedule
        </span>
        {patient.lastVisit}
      </p>
      <button
        className="bg-white text-primary font-semibold rounded py-1 mt-auto cursor-pointer"
        onClick={() => onView?.(patient)}
      >
        Ver Perfil
      </button>
    </div>
  );
}
