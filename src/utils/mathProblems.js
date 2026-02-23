function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficultyRange(difficulty) {
  if (difficulty === 'easy') return { min: 1, max: 9 };
  if (difficulty === 'medium') return { min: 10, max: 99 };
  return { min: 100, max: 999 };
}

export function generateProblem(difficulty, operation) {
  var range = getDifficultyRange(difficulty);
  var op = operation;
  if (operation === 'mixed') {
    op = Math.random() < 0.5 ? 'addition' : 'subtraction';
  }

  var num1, num2, answer;

  if (op === 'addition') {
    num1 = randomInt(range.min, range.max);
    num2 = randomInt(range.min, range.max);
    answer = num1 + num2;
  } else {
    answer = randomInt(range.min, range.max);
    num2 = randomInt(range.min, range.max);
    num1 = answer + num2;
  }

  var distractors = generateDistractors(answer, difficulty);

  return {
    num1: num1,
    num2: num2,
    operation: op,
    answer: answer,
    choices: shuffle([answer].concat(distractors)),
    symbol: op === 'addition' ? '+' : '-',
  };
}

function generateDistractors(correct, difficulty) {
  var spread = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 10;
  var distractors = [];
  var attempts = 0;

  while (distractors.length < 3 && attempts < 50) {
    var offset = randomInt(1, spread) * (Math.random() < 0.5 ? 1 : -1);
    var val = correct + offset;
    if (val >= 0 && val !== correct && distractors.indexOf(val) === -1) {
      distractors.push(val);
    }
    attempts++;
  }

  while (distractors.length < 3) {
    distractors.push(correct + distractors.length + 1);
  }

  return distractors;
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

export function generateProblemsSet(count, difficulty, operation) {
  var problems = [];
  for (var i = 0; i < count; i++) {
    problems.push(generateProblem(difficulty, operation));
  }
  return problems;
}

export function numberToWords(n) {
  var ones = ['zero','one','two','three','four','five','six','seven','eight','nine',
    'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

  if (n < 20) return ones[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }
  if (n < 1000) {
    var rest = n % 100;
    return ones[Math.floor(n / 100)] + ' hundred' + (rest ? ' and ' + numberToWords(rest) : '');
  }
  return String(n);
}

export function generateSolutionSteps(num1, num2, operation, difficulty) {
  if (difficulty === 'easy') {
    return generateCountingSteps(num1, num2, operation);
  }
  return generateColumnSteps(num1, num2, operation);
}

function generateCountingSteps(num1, num2, operation) {
  var answer = operation === 'addition' ? num1 + num2 : num1 - num2;
  var steps = [];

  if (operation === 'addition') {
    steps.push({
      type: 'intro',
      description: "Let's add " + num1 + " and " + num2 + "!",
      ttsText: "Let's add " + numberToWords(num1) + " and " + numberToWords(num2),
    });
    steps.push({
      type: 'show_group1',
      description: 'Here are ' + num1 + ' red cars:',
      ttsText: 'Here are ' + numberToWords(num1) + ' red cars',
      count: num1,
      color: 'red',
    });
    steps.push({
      type: 'show_group2',
      description: 'And here are ' + num2 + ' blue cars:',
      ttsText: 'And here are ' + numberToWords(num2) + ' blue cars',
      count: num2,
      color: 'blue',
    });
    steps.push({
      type: 'merge',
      description: "Now let's put them all together!",
      ttsText: "Now let's put them all together!",
      total: answer,
      group1: num1,
      group2: num2,
    });
    steps.push({
      type: 'count_all',
      description: "Let's count them all!",
      ttsText: buildCountingText(answer),
      total: answer,
      group1: num1,
      group2: num2,
    });
    steps.push({
      type: 'answer',
      description: num1 + ' + ' + num2 + ' = ' + answer + '!',
      ttsText: numberToWords(num1) + ' plus ' + numberToWords(num2) + ' equals ' + numberToWords(answer) + '! Vroom vroom!',
      answer: answer,
    });
  } else {
    steps.push({
      type: 'intro',
      description: "Let's subtract " + num2 + " from " + num1 + "!",
      ttsText: "Let's take away " + numberToWords(num2) + " from " + numberToWords(num1),
    });
    steps.push({
      type: 'show_group1',
      description: 'We have ' + num1 + ' cars:',
      ttsText: 'We have ' + numberToWords(num1) + ' cars',
      count: num1,
      color: 'red',
    });
    steps.push({
      type: 'remove',
      description: num2 + ' cars drive away!',
      ttsText: numberToWords(num2) + ' cars drive away!',
      removeCount: num2,
      remaining: answer,
    });
    steps.push({
      type: 'count_remaining',
      description: "Let's count what's left!",
      ttsText: buildCountingText(answer),
      total: answer,
    });
    steps.push({
      type: 'answer',
      description: num1 + ' - ' + num2 + ' = ' + answer + '!',
      ttsText: numberToWords(num1) + ' minus ' + numberToWords(num2) + ' equals ' + numberToWords(answer) + '! Great job!',
      answer: answer,
    });
  }

  return steps;
}

function buildCountingText(n) {
  var parts = [];
  for (var i = 1; i <= n; i++) {
    parts.push(numberToWords(i));
  }
  return "Let's count: " + parts.join(', ') + '!';
}

function getDigits(num, places) {
  var digits = [];
  for (var i = 0; i < places; i++) {
    digits.push(Math.floor(num / Math.pow(10, i)) % 10);
  }
  return digits;
}

function placeWord(place) {
  if (place === 0) return 'ones';
  if (place === 1) return 'tens';
  if (place === 2) return 'hundreds';
  return 'place ' + place;
}

function generateColumnSteps(num1, num2, operation) {
  var steps = [];
  var answer = operation === 'addition' ? num1 + num2 : num1 - num2;
  var maxDigits = String(Math.max(num1, num2, Math.abs(answer))).length + 1;
  var digits1 = getDigits(num1, maxDigits);
  var digits2 = getDigits(num2, maxDigits);
  var symbol = operation === 'addition' ? '+' : '-';

  steps.push({
    type: 'column_intro',
    description: "Let's stack the numbers!",
    ttsText: "Let's stack " + numberToWords(num1) + " " + (operation === 'addition' ? 'plus' : 'minus') + " " + numberToWords(num2),
    num1: num1,
    num2: num2,
    symbol: symbol,
    answerDigits: [],
    carries: [],
    borrows: [],
    currentColumn: -1,
  });

  if (operation === 'addition') {
    var carry = 0;
    var answerDigits = [];
    var carries = [];

    for (var col = 0; col < maxDigits; col++) {
      var d1 = digits1[col];
      var d2 = digits2[col];
      var sum = d1 + d2 + carry;

      if (d1 === 0 && d2 === 0 && carry === 0) break;

      var colName = placeWord(col);
      var stepDesc = '';
      var stepTTS = '';

      if (carry > 0) {
        stepDesc = colName + ' column: ' + d1 + ' + ' + d2 + ' + ' + carry + ' (carry) = ' + sum;
        stepTTS = 'Now the ' + colName + ' column: ' + numberToWords(d1) + ' plus ' + numberToWords(d2) + ' plus ' + numberToWords(carry) + ' carry equals ' + numberToWords(sum);
      } else {
        stepDesc = colName + ' column: ' + d1 + ' + ' + d2 + ' = ' + sum;
        stepTTS = 'Start with the ' + colName + ' column: ' + numberToWords(d1) + ' plus ' + numberToWords(d2) + ' equals ' + numberToWords(sum);
      }

      var newCarry = Math.floor(sum / 10);
      var digit = sum % 10;
      answerDigits.push(digit);

      if (newCarry > 0) {
        stepDesc += '. Write ' + digit + ', carry the ' + newCarry + '!';
        stepTTS += '. Write ' + numberToWords(digit) + ' and carry the ' + numberToWords(newCarry) + '!';
        carries.push({ column: col + 1, value: newCarry });
      }

      carry = newCarry;

      steps.push({
        type: 'column_step',
        description: stepDesc,
        ttsText: stepTTS,
        num1: num1,
        num2: num2,
        symbol: symbol,
        answerDigits: answerDigits.slice(),
        carries: carries.slice(),
        borrows: [],
        currentColumn: col,
        columnResult: sum,
        digitWritten: digit,
        carryValue: newCarry,
      });
    }

    steps.push({
      type: 'column_answer',
      description: 'The answer is ' + answer + '!',
      ttsText: 'The answer is ' + numberToWords(answer) + '! Vroom vroom!',
      num1: num1,
      num2: num2,
      symbol: symbol,
      answer: answer,
      answerDigits: answerDigits,
      carries: carries,
      borrows: [],
    });
  } else {
    var borrowed = new Array(maxDigits).fill(0);
    var workingDigits = digits1.slice();
    var ansDigits = [];
    var borrows = [];

    for (var col2 = 0; col2 < maxDigits; col2++) {
      var dd1 = workingDigits[col2];
      var dd2 = digits2[col2];

      if (dd1 === 0 && dd2 === 0 && col2 > 0) break;

      var colName2 = placeWord(col2);

      if (dd1 < dd2) {
        var borrowFrom = col2 + 1;
        workingDigits[borrowFrom] = workingDigits[borrowFrom] - 1;
        workingDigits[col2] = dd1 + 10;
        dd1 = workingDigits[col2];

        borrows.push({ column: col2, from: borrowFrom });

        var borrowDesc = colName2 + ' column: ' + (dd1 - 10) + ' is less than ' + dd2 + '! Borrow from ' + placeWord(borrowFrom) + '.';
        var borrowTTS = colName2 + ' column: ' + numberToWords(dd1 - 10) + ' is less than ' + numberToWords(dd2) + '! We need to borrow from the ' + placeWord(borrowFrom) + ' column.';

        steps.push({
          type: 'column_borrow',
          description: borrowDesc,
          ttsText: borrowTTS,
          num1: num1,
          num2: num2,
          symbol: symbol,
          answerDigits: ansDigits.slice(),
          carries: [],
          borrows: borrows.slice(),
          currentColumn: col2,
          workingDigits: workingDigits.slice(),
        });
      }

      var diff = dd1 - dd2;
      ansDigits.push(diff);

      var stepDesc2 = colName2 + ' column: ' + dd1 + ' - ' + dd2 + ' = ' + diff;
      var stepTTS2 = colName2 + ' column: ' + numberToWords(dd1) + ' minus ' + numberToWords(dd2) + ' equals ' + numberToWords(diff);

      steps.push({
        type: 'column_step',
        description: stepDesc2,
        ttsText: stepTTS2,
        num1: num1,
        num2: num2,
        symbol: symbol,
        answerDigits: ansDigits.slice(),
        carries: [],
        borrows: borrows.slice(),
        currentColumn: col2,
        columnResult: diff,
        digitWritten: diff,
        carryValue: 0,
      });
    }

    steps.push({
      type: 'column_answer',
      description: 'The answer is ' + answer + '!',
      ttsText: 'The answer is ' + numberToWords(answer) + '! Great job!',
      num1: num1,
      num2: num2,
      symbol: symbol,
      answer: answer,
      answerDigits: ansDigits,
      carries: [],
      borrows: borrows,
    });
  }

  return steps;
}
