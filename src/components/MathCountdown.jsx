import { useState, useEffect } from 'react';
import speedyImg from '../assets/speedy.png';

export default function MathCountdown({ onDone, carImg, carImg2 }) {
  var countState = useState(3);
  var count = countState[0];
  var setCount = countState[1];

  useEffect(function () {
    if (count === 0) {
      var timer = setTimeout(function () {
        onDone();
      }, 800);
      return function () { clearTimeout(timer); };
    }
    var timer2 = setTimeout(function () {
      setCount(function (c) { return c - 1; });
    }, 1000);
    return function () { clearTimeout(timer2); };
  }, [count, onDone]);

  var colors = ['#27ae60', '#f39c12', '#e74c3c'];
  var labels = ['GO!', '1', '2', '3'];

  return (
    <div className="screen countdown-screen">
      <div className="countdown-cars">
        <img src={carImg || speedyImg} alt="Car 1" className="countdown-car" />
        {carImg2 && <img src={carImg2} alt="Car 2" className="countdown-car countdown-car-2" />}
      </div>
      <div
        className="countdown-number"
        style={{ color: colors[count] || '#27ae60' }}
        key={count}
      >
        {labels[count]}
      </div>
    </div>
  );
}
