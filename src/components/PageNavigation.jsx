export default function PageNavigation({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="page-navigation">
      <button
        className="nav-btn nav-prev"
        onClick={onPrev}
        onTouchEnd={(e) => { e.preventDefault(); onPrev(); }}
        disabled={currentPage <= 0}
      >
        ← Back
      </button>

      <span className="page-indicator">
        {currentPage + 1} / {totalPages}
      </span>

      <button
        className="nav-btn nav-next"
        onClick={onNext}
        onTouchEnd={(e) => { e.preventDefault(); onNext(); }}
        disabled={currentPage >= totalPages - 1}
      >
        Next →
      </button>
    </div>
  );
}
