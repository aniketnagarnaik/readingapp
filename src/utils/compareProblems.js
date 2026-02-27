function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficultyRange(difficulty) {
  if (difficulty === 'easy') return { min: 1, max: 9 };
  if (difficulty === 'medium') return { min: 10, max: 99 };
  return { min: 100, max: 999 };
}

export function numberToWords(n) {
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine',
    'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
  return String(n);
}

export function generateCompareProblem(difficulty) {
  var range = getDifficultyRange(difficulty);
  var isEqual = Math.random() < 0.18;
  var num1, num2, answer, speakText;

  if (isEqual) {
    num1 = randomInt(range.min, range.max);
    num2 = num1;
    answer = 'equal';
    speakText = 'Are these the same? ' + numberToWords(num1) + ' and ' + numberToWords(num2) + '?';
  } else {
    num1 = randomInt(range.min, range.max);
    num2 = randomInt(range.min, range.max);
    while (num2 === num1) {
      num2 = randomInt(range.min, range.max);
    }
    if (num1 > num2) {
      answer = 'left';
    } else {
      answer = 'right';
    }
    speakText = 'Which is bigger? ' + numberToWords(num1) + ' or ' + numberToWords(num2) + '?';
  }

  return {
    num1: num1,
    num2: num2,
    answer: answer,
    speakText: speakText,
  };
}

export function generateCompareProblemsSet(count, difficulty) {
  var problems = [];
  for (var i = 0; i < count; i++) {
    problems.push(generateCompareProblem(difficulty));
  }
  return problems;
}
