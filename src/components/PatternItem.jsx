import CAR_CHARACTERS from '../utils/carCharacters';

function getCarImg(carId) {
  for (var i = 0; i < CAR_CHARACTERS.length; i++) {
    if (CAR_CHARACTERS[i].id === carId) return CAR_CHARACTERS[i].img;
  }
  return CAR_CHARACTERS[0].img;
}

export default function PatternItem({ item, size }) {
  var s = size || 'medium';
  var cls = 'pattern-item pattern-item-' + s;

  if (item.poolType === 'color') {
    return (
      <div className={cls + ' pattern-item-color'} style={{ background: item.value }} />
    );
  }

  if (item.poolType === 'shape') {
    return (
      <div className={cls + ' pattern-item-shape'}>
        <span className="pattern-shape-char">{item.label}</span>
      </div>
    );
  }

  if (item.poolType === 'emoji') {
    return (
      <div className={cls + ' pattern-item-emoji'}>
        <span className="pattern-emoji-char">{item.label}</span>
      </div>
    );
  }

  if (item.poolType === 'car') {
    return (
      <div className={cls + ' pattern-item-car'}>
        <img src={getCarImg(item.id)} alt={item.speakName} className="pattern-car-img" />
      </div>
    );
  }

  if (item.poolType === 'number') {
    return (
      <div className={cls + ' pattern-item-number'}>
        <span className="pattern-number-text">{item.value}</span>
      </div>
    );
  }

  return null;
}
