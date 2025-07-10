import { useState } from "react";

export default function RecipeCard({ prescription }) {
  const { patientName, patientDni, issuedAt, items } = prescription;
  const [showNotification, setShowNotification] = useState(false);

  const formattedDate = new Date(issuedAt).toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleSend = () => {
    setShowNotification(true);
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="bg-teal-800 text-white p-4 rounded mb-6 shadow relative">
      {/* Notificación popup */}
      {showNotification && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white px-4 py-2 rounded shadow-lg z-10 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Correo enviado con la receta</span>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
        </div>
      )}
      
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
        <button 
          className="bg-white text-teal-800 px-4 py-1 rounded"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
