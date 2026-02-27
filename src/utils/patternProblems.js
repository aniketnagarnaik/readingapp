function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = randomInt(0, i);
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function pickRandom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function pickN(arr, n) {
  var shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}

/* ---- Element Pools ---- */

var COLOR_POOL = [
  { id: 'red', label: 'Red', value: '#e74c3c', speakName: 'red' },
  { id: 'blue', label: 'Blue', value: '#3498db', speakName: 'blue' },
  { id: 'green', label: 'Green', value: '#27ae60', speakName: 'green' },
  { id: 'yellow', label: 'Yellow', value: '#f1c40f', speakName: 'yellow' },
  { id: 'purple', label: 'Purple', value: '#8e44ad', speakName: 'purple' },
  { id: 'orange', label: 'Orange', value: '#e67e22', speakName: 'orange' },
];

var SHAPE_POOL = [
  { id: 'circle', label: '●', speakName: 'circle' },
  { id: 'square', label: '■', speakName: 'square' },
  { id: 'triangle', label: '▲', speakName: 'triangle' },
  { id: 'star', label: '★', speakName: 'star' },
  { id: 'diamond', label: '◆', speakName: 'diamond' },
  { id: 'heart', label: '♥', speakName: 'heart' },
];

var EMOJI_POOL = [
  { id: 'car', label: '🏎️', speakName: 'race car' },
  { id: 'flag', label: '🏁', speakName: 'flag' },
  { id: 'trophy', label: '🏆', speakName: 'trophy' },
  { id: 'star', label: '⭐', speakName: 'star' },
  { id: 'medal', label: '🥇', speakName: 'medal' },
  { id: 'fire', label: '🔥', speakName: 'fire' },
  { id: 'bolt', label: '⚡', speakName: 'lightning' },
  { id: 'wheel', label: '🛞', speakName: 'wheel' },
];

var CAR_POOL = [
  { id: 'speedy', speakName: 'Speedy' },
  { id: 'turbo', speakName: 'Turbo' },
  { id: 'champion', speakName: 'Champion' },
  { id: 'shadow', speakName: 'Shadow' },
  { id: 'sunny', speakName: 'Sunny' },
];

/* ---- Pattern Types ---- */

function applyPattern(pattern, elements) {
  var seq = [];
  for (var i = 0; i < pattern.length; i++) {
    var idx = pattern.charCodeAt(i) - 65; // A=0, B=1, C=2, D=3
    seq.push(elements[idx]);
  }
  return seq;
}

var EASY_PATTERNS = ['ABABAB', 'AABBAABB', 'AABAAB'];
var MEDIUM_PATTERNS = ['ABCABC', 'AABCAABC', 'ABBABB', 'ABACABAC'];
var HARD_PATTERNS = ['AABBCCAABBCC', 'ABCDABCD', 'ABCBABCB', 'ABACBC'];

function getPatternsByDifficulty(level) {
  if (level <= 1) return EASY_PATTERNS;
  if (level <= 2) return MEDIUM_PATTERNS;
  return HARD_PATTERNS;
}

function getRequiredElements(pattern) {
  var maxCode = 0;
  for (var i = 0; i < pattern.length; i++) {
    var code = pattern.charCodeAt(i) - 65;
    if (code > maxCode) maxCode = code;
  }
  return maxCode + 1;
}

/* ---- Number sequence patterns ---- */

function generateNumberPattern(level) {
  var sequences, seq, step, start;

  if (level <= 1) {
    start = randomInt(1, 5);
    seq = [];
    for (var i = 0; i < 7; i++) seq.push(start + i);
  } else if (level <= 2) {
    step = pickRandom([2, 3, 5]);
    start = step === 2 ? randomInt(0, 4) * 2 : step === 3 ? randomInt(0, 3) * 3 : randomInt(0, 3) * 5;
    seq = [];
    for (var j = 0; j < 7; j++) seq.push(start + step * j);
  } else {
    step = pickRandom([2, 3, 4, 5, 10]);
    start = randomInt(1, 5) * step;
    seq = [];
    for (var k = 0; k < 7; k++) seq.push(start + step * k);
  }

  var showCount = randomInt(5, 6);
  var visibleSeq = seq.slice(0, showCount);
  var answer = seq[showCount];

  var distractors = [];
  var used = {};
  used[answer] = true;
  var tries = 0;
  while (distractors.length < 3 && tries < 50) {
    tries++;
    var d;
    var r = Math.random();
    if (r < 0.3) {
      d = answer + randomInt(1, 3);
    } else if (r < 0.6) {
      d = answer - randomInt(1, 3);
    } else {
      d = answer + pickRandom([-2, -1, 1, 2, 3]);
    }
    if (d >= 0 && !used[d]) {
      used[d] = true;
      distractors.push(d);
    }
  }
  while (distractors.length < 3) {
    distractors.push(answer + distractors.length + 1);
  }

  var sequence = [];
  for (var n = 0; n < visibleSeq.length; n++) {
    sequence.push({ poolType: 'number', value: visibleSeq[n], id: 'num-' + visibleSeq[n] });
  }

  var answerItem = { poolType: 'number', value: answer, id: 'num-' + answer };
  var choiceItems = shuffle(
    [answerItem].concat(distractors.map(function (d) {
      return { poolType: 'number', value: d, id: 'num-' + d };
    }))
  );

  var speakParts = visibleSeq.map(function (n) { return String(n); });
  var speakText = speakParts.join(', ') + '... what comes next?';

  return {
    sequence: sequence,
    answer: answerItem,
    choices: choiceItems,
    poolType: 'number',
    speakText: speakText,
  };
}

/* ---- Visual pattern generation ---- */

function generateVisualPattern(level) {
  var poolTypes = ['color', 'shape', 'emoji', 'car'];
  var poolType = pickRandom(poolTypes);
  var patterns = getPatternsByDifficulty(level);
  var pattern = pickRandom(patterns);
  var needed = getRequiredElements(pattern);

  var pool, elements;

  if (poolType === 'color') {
    elements = pickN(COLOR_POOL, needed);
  } else if (poolType === 'shape') {
    elements = pickN(SHAPE_POOL, needed);
  } else if (poolType === 'emoji') {
    elements = pickN(EMOJI_POOL, needed);
  } else {
    elements = pickN(CAR_POOL, needed);
  }

  var fullSeq = applyPattern(pattern, elements);
  var showCount = fullSeq.length - 1;
  var visibleSeq = fullSeq.slice(0, showCount);
  var answerElement = fullSeq[showCount];

  var sequence = visibleSeq.map(function (el) {
    return buildItem(poolType, el);
  });

  var answerItem = buildItem(poolType, answerElement);

  var distractorPool;
  if (poolType === 'color') distractorPool = COLOR_POOL;
  else if (poolType === 'shape') distractorPool = SHAPE_POOL;
  else if (poolType === 'emoji') distractorPool = EMOJI_POOL;
  else distractorPool = CAR_POOL;

  var usedIds = {};
  usedIds[answerItem.id] = true;
  var distractors = [];
  var shuffledPool = shuffle(distractorPool);
  for (var i = 0; i < shuffledPool.length && distractors.length < 3; i++) {
    var item = buildItem(poolType, shuffledPool[i]);
    if (!usedIds[item.id]) {
      usedIds[item.id] = true;
      distractors.push(item);
    }
  }

  var choiceItems = shuffle([answerItem].concat(distractors));

  var speakParts = visibleSeq.map(function (el) { return el.speakName; });
  var speakText = speakParts.join(', ') + '... what comes next?';

  return {
    sequence: sequence,
    answer: answerItem,
    choices: choiceItems,
    poolType: poolType,
    speakText: speakText,
  };
}

function buildItem(poolType, el) {
  if (poolType === 'color') {
    return { poolType: 'color', id: el.id, value: el.value, label: el.label, speakName: el.speakName };
  }
  if (poolType === 'shape') {
    return { poolType: 'shape', id: el.id, label: el.label, speakName: el.speakName };
  }
  if (poolType === 'emoji') {
    return { poolType: 'emoji', id: el.id, label: el.label, speakName: el.speakName };
  }
  return { poolType: 'car', id: el.id, speakName: el.speakName };
}

/* ---- Public API ---- */

export function generatePatternProblem(level) {
  if (level >= 2 && Math.random() < 0.35) {
    return generateNumberPattern(level);
  }
  if (level >= 3 && Math.random() < 0.5) {
    return generateNumberPattern(level);
  }
  return generateVisualPattern(level);
}

export function generatePatternSet(count) {
  var problems = [];
  for (var i = 0; i < count; i++) {
    var level;
    if (i < 2) level = 1;
    else if (i < 4) level = 2;
    else level = 3;
    problems.push(generatePatternProblem(level));
  }
  return problems;
}
