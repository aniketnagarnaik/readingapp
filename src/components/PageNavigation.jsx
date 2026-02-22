import TapButton from './TapButton';

export default function PageNavigation({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="page-navigation">
      <TapButton
        className="nav-btn nav-prev"
        onClick={onPrev}
        disabled={currentPage <= 0}
      >
        ← Back
      </TapButton>

      <span className="page-indicator">
        {currentPage + 1} / {totalPages}
      </span>

      <TapButton
        className="nav-btn nav-next"
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
      >
        Next →
      </TapButton>
    </div>
  );
}
