import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function FilterPanel({ onApply, onClear }) {
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [gender, setGender] = useState("");

  const handleApply = () => {
    onApply({
      minAge: ageRange[0],
      maxAge: ageRange[1],
      gender,
    });
  };

  return (
    <aside className="w-64 p-4 border rounded shadow">
      <h2 className="font-semibold mb-4">Filtros</h2>

      {/* Edad */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Rango de Edad</label>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={ageRange}
          onChange={setAgeRange}
        />
        <div className="text-sm mt-2">
          {ageRange[0]} años - {ageRange[1]} años
        </div>
      </div>

      {/* Género */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Género</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleApply}
        >
          Aplicar
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>
    </aside>
  );
}
