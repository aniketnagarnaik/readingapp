import { useState, useEffect, useRef } from 'react';

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

  if (type === 'merge') {
    return <MergedCars step={step} counting={false} />;
  }

  if (type === 'count_all') {
    return <MergedCars step={step} counting={true} />;
  }

  if (type === 'remove') {
    var originalCount = step.originalCount || (step.remaining + step.removeCount);
    var allCarsRemove = [];
    for (var k = 0; k < originalCount; k++) {
      var isLeaving = k >= step.remaining;
      allCarsRemove.push(
        <div key={k} className={'counting-car-wrapper' + (isLeaving ? ' counting-car-leaving-wrapper' : '')}>
          <span className={'counting-car counting-car-red' + (isLeaving ? ' counting-car-driving-away' : '')}>
            🚗
          </span>
          {isLeaving && (
            <span className="counting-bye">✖</span>
          )}
        </div>
      );
    }
    return (
      <div className="car-counting">
        <div className="counting-row counting-row-merged">{allCarsRemove}</div>
        <div className="counting-remove-label">
          <span className="counting-remove-text">
            {step.removeCount} drove away!
          </span>
        </div>
      </div>
    );
  }

  if (type === 'count_remaining') {
    return (
      <SubtractionCounting
        total={step.total}
        removedCount={step.removedCount || 0}
        originalCount={step.originalCount || step.total}
      />
    );
  }

  return null;
}

function MergedCars({ step, counting }) {
  var group1 = step.group1 || 0;
  var group2 = step.group2 || 0;
  var total = step.total;

  if (counting) {
    return <CountingWithPointer total={total} group1={group1} group2={group2} />;
  }

  var cars = [];
  for (var i = 0; i < total; i++) {
    var color = i < group1 ? 'red' : 'blue';
    cars.push(
      <div key={i} className="counting-car-wrapper">
        <span className={'counting-car counting-car-' + color + ' counting-car-merged'}>
          🚗
        </span>
      </div>
    );
  }

  return (
    <div className="car-counting">
      <div className="counting-row counting-row-merged">{cars}</div>
    </div>
  );
}

function SubtractionCounting({ total, removedCount, originalCount }) {
  var highlightState = useState(-1);
  var highlightIndex = highlightState[0];
  var setHighlightIndex = highlightState[1];
  var timerRef = useRef(null);

  useEffect(function () {
    var idx = 0;
    setHighlightIndex(0);

    timerRef.current = setInterval(function () {
      idx = idx + 1;
      if (idx >= total) {
        clearInterval(timerRef.current);
        setHighlightIndex(total - 1);
        return;
      }
      setHighlightIndex(idx);
    }, 800);

    return function () {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  var cars = [];
  for (var i = 0; i < originalCount; i++) {
    var isRemoved = i >= total;
    var isActive = !isRemoved && i === highlightIndex;
    var isCounted = !isRemoved && i <= highlightIndex;

    cars.push(
      <div key={i} className={'counting-car-wrapper' + (isActive ? ' counting-active' : '') + (isRemoved ? ' counting-car-gone-wrapper' : '')}>
        <span className={'counting-car counting-car-red' + (isActive ? ' counting-car-highlight' : '') + (isRemoved ? ' counting-car-gone' : '')}>
          🚗
        </span>
        {isRemoved && (
          <span className="counting-bye-small">✖</span>
        )}
        {isCounted && !isRemoved && (
          <span className="counting-number">{i + 1}</span>
        )}
        {isActive && (
          <span className="counting-pointer">👆</span>
        )}
      </div>
    );
  }

  return (
    <div className="car-counting">
      <div className="counting-row counting-row-merged">{cars}</div>
    </div>
  );
}

function CountingWithPointer({ total, group1, group2 }) {
  var highlightState = useState(-1);
  var highlightIndex = highlightState[0];
  var setHighlightIndex = highlightState[1];
  var timerRef = useRef(null);

  useEffect(function () {
    var idx = 0;
    setHighlightIndex(0);

    timerRef.current = setInterval(function () {
      idx = idx + 1;
      if (idx >= total) {
        clearInterval(timerRef.current);
        setHighlightIndex(total - 1);
        return;
      }
      setHighlightIndex(idx);
    }, 800);

    return function () {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  var cars = [];
  for (var i = 0; i < total; i++) {
    var color = i < group1 ? 'red' : 'blue';
    var isActive = i === highlightIndex;
    var isCounted = i <= highlightIndex;

    cars.push(
      <div key={i} className={'counting-car-wrapper' + (isActive ? ' counting-active' : '')}>
        <span className={'counting-car counting-car-' + color + (isActive ? ' counting-car-highlight' : '')}>
          🚗
        </span>
        {isCounted && (
          <span className="counting-number">{i + 1}</span>
        )}
        {isActive && (
          <span className="counting-pointer">👆</span>
        )}
      </div>
    );
  }

  return (
    <div className="car-counting">
      <div className="counting-row counting-row-merged">{cars}</div>
    </div>
  );
}
