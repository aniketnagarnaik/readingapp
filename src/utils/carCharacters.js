import speedyImg from '../assets/speedy.png';
import turboImg from '../assets/turbo.png';
import championImg from '../assets/champion.png';
import shadowImg from '../assets/shadow.png';
import sunnyImg from '../assets/sunny.png';

var CAR_CHARACTERS = [
  { id: 'speedy', name: 'Speedy', img: speedyImg, color: '#e74c3c' },
  { id: 'turbo', name: 'Turbo', img: turboImg, color: '#27ae60' },
  { id: 'champion', name: 'Champion', img: championImg, color: '#2980b9' },
  { id: 'shadow', name: 'Shadow', img: shadowImg, color: '#2c3e50' },
  { id: 'sunny', name: 'Sunny', img: sunnyImg, color: '#f1c40f' },
];

export default CAR_CHARACTERS;

export function getCarById(id) {
  for (var i = 0; i < CAR_CHARACTERS.length; i++) {
    if (CAR_CHARACTERS[i].id === id) return CAR_CHARACTERS[i];
  }
  return CAR_CHARACTERS[0];
}
