export default function RecipeCard({ prescription }) {
  const { patientName, patientDni, issuedAt, items } = prescription;

  const formattedDate = new Date(issuedAt).toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-teal-800 text-white p-4 rounded mb-6 shadow">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <p className="font-semibold">Paciente: {patientName}</p>
          <p className="text-sm">Identificación: {patientDni}</p>
        </div>
        <p className="text-sm text-right">{formattedDate}</p>
      </div>

      <div className="my-4 border-t border-white/40 pt-3 space-y-2">
        {items.map((item, index) => (
          <div key={index}>
            <p className="font-semibold">{item.medication}</p>
            <p className="text-sm">
              {item.dosage}, {item.administration_route}. Por {item.duration_days} días
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button className="bg-white text-teal-800 px-4 py-1 rounded">
          Imprimir
        </button>
        <button className="bg-white text-teal-800 px-4 py-1 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
}
