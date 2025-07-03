export default function Pagination({ page, totalPages, onChange }) {
  const numbers = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-2 disabled:text-gray-400"
      >
        &lt;
      </button>

      {numbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`px-2 ${n === page ? "font-bold" : ""}`}
        >
          {n}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-2 disabled:text-gray-400"
      >
        &gt;
      </button>
    </div>
  );
}
