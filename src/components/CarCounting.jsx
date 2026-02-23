export default function CarCounting({ step }) {
  if (!step) return null;

  var type = step.type;

  if (type === 'show_group1' || type === 'show_group2') {
    var cars = [];
    for (var i = 0; i < step.count; i++) {
      cars.push(
        <span key={i} className={'counting-car counting-car-' + step.color}>
          🚗
        </span>
      );
    }
    return (
      <div className="car-counting">
        <div className="counting-row">{cars}</div>
      </div>
    );
  }

  if (type === 'merge' || type === 'count_all') {
    var allCars = [];
    for (var j = 0; j < step.total; j++) {
      allCars.push(
        <span key={j} className="counting-car counting-car-merged">
          🚗
        </span>
      );
    }
    return (
      <div className="car-counting">
        <div className="counting-row counting-row-merged">{allCars}</div>
      </div>
    );
  }

  if (type === 'remove') {
    var remaining = [];
    for (var k = 0; k < step.remaining; k++) {
      remaining.push(
        <span key={'r' + k} className="counting-car counting-car-red">
          🚗
        </span>
      );
    }
    var removed = [];
    for (var l = 0; l < step.removeCount; l++) {
      removed.push(
        <span key={'x' + l} className="counting-car counting-car-leaving">
          🚗
        </span>
      );
    }
    return (
      <div className="car-counting">
        <div className="counting-row">{remaining}</div>
        <div className="counting-row counting-row-leaving">{removed}</div>
      </div>
    );
  }

  if (type === 'count_remaining') {
    var leftCars = [];
    for (var m = 0; m < step.total; m++) {
      leftCars.push(
        <span key={m} className="counting-car counting-car-red">
          🚗
        </span>
      );
    }
    return (
      <div className="car-counting">
        <div className="counting-row">{leftCars}</div>
      </div>
    );
  }

  return null;
}
