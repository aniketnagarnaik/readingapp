import { useState } from 'react';
import CAR_CHARACTERS from '../utils/carCharacters';

export default function CharacterSelect({ playerCount, onDone, onBack }) {
  var phaseState = useState(1);
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var p1State = useState(null);
  var p1Car = p1State[0];
  var setP1Car = p1State[1];

  var p2State = useState(null);
  var p2Car = p2State[0];
  var setP2Car = p2State[1];

  var handleSelect = function (car) {
    if (playerCount === 1) {
      onDone(car.id, null);
      return;
    }

    if (phase === 1) {
      setP1Car(car.id);
      setPhase(2);
    } else {
      setP2Car(car.id);
      onDone(p1Car, car.id);
    }
  };

  var title = playerCount === 1
    ? 'Pick Your Car!'
    : phase === 1
    ? 'Player 1 - Pick Your Car!'
    : 'Player 2 - Pick Your Car!';

  var disabledId = phase === 2 ? p1Car : null;

  return (
    <div className="screen char-select-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h2 className="char-select-title">{title}</h2>

      {phase === 2 && (
        <p className="char-select-subtitle">
          Player 1 chose {CAR_CHARACTERS.filter(function (c) { return c.id === p1Car; })[0].name}!
        </p>
      )}

      <div className="char-grid">
        {CAR_CHARACTERS.map(function (car) {
          var isDisabled = car.id === disabledId;
          return (
            <div
              key={car.id}
              role="button"
              tabIndex={0}
              className={'char-card' + (isDisabled ? ' char-card-disabled' : '')}
              onClick={function () { if (!isDisabled) handleSelect(car); }}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', borderColor: car.color }}
            >
              <img src={car.img} alt={car.name} className="char-card-img" />
              <span className="char-card-name">{car.name}</span>
              {isDisabled && <span className="char-card-taken">Taken!</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
