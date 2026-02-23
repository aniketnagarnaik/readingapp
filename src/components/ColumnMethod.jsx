export default function ColumnMethod({ step }) {
  if (!step || !step.num1) return null;

  var num1 = step.num1;
  var num2 = step.num2;
  var symbol = step.symbol;
  var answerDigits = step.answerDigits || [];
  var carries = step.carries || [];
  var borrows = step.borrows || [];
  var currentColumn = step.currentColumn;
  var maxLen = Math.max(String(num1).length, String(num2).length, answerDigits.length) + 1;

  var digits1 = padDigits(num1, maxLen);
  var digits2 = padDigits(num2, maxLen);
  var ansDigits = padAnswer(answerDigits, maxLen);

  var carryRow = new Array(maxLen).fill(null);
  carries.forEach(function (c) {
    if (c.column < maxLen) {
      carryRow[maxLen - 1 - c.column] = c.value;
    }
  });

  var borrowedCols = {};
  borrows.forEach(function (b) {
    borrowedCols[b.column] = true;
    borrowedCols[b.from] = 'from';
  });

  var workingDigits = step.workingDigits;

  return (
    <div className="column-method">
      <div className="column-row column-carry-row">
        {carryRow.map(function (val, i) {
          return (
            <span key={'c' + i} className="column-cell column-carry-cell">
              {val != null ? val : ''}
            </span>
          );
        })}
      </div>

      <div className="column-row">
        <span className="column-cell column-symbol-cell">{''}</span>
        {digits1.map(function (d, i) {
          var isActive = currentColumn >= 0 && (maxLen - 1 - i) === currentColumn;
          return (
            <span key={'a' + i} className={'column-cell' + (isActive ? ' column-cell-active' : '')}>
              {d}
            </span>
          );
        })}
      </div>

      <div className="column-row">
        <span className="column-cell column-symbol-cell">{symbol}</span>
        {digits2.map(function (d, i) {
          var isActive = currentColumn >= 0 && (maxLen - 1 - i) === currentColumn;
          return (
            <span key={'b' + i} className={'column-cell' + (isActive ? ' column-cell-active' : '')}>
              {d}
            </span>
          );
        })}
      </div>

      <div className="column-divider" />

      <div className="column-row column-answer-row">
        <span className="column-cell column-symbol-cell">{''}</span>
        {ansDigits.map(function (d, i) {
          return (
            <span key={'r' + i} className="column-cell column-answer-cell">
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function padDigits(num, len) {
  var s = String(num);
  while (s.length < len) s = ' ' + s;
  return s.split('');
}

function padAnswer(digits, len) {
  var reversed = digits.slice().reverse();
  while (reversed.length < len) reversed.unshift(' ');
  return reversed;
}
