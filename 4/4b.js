const MIN = 357253;
const MAX = 892942;

function hasExactlyTwoAdjacentEqualDigits(num) {
  const splitted = num.toString().split("");
  const equalAdjacents = [];
  let adjacent = "";
  for (let i = 0; i < splitted.length - 1; i++) {
    if (adjacent.length <= 1) {
      adjacent = splitted[i];
    }
    if (splitted[i] === splitted[i + 1]) {
      adjacent += splitted[i + 1];
      if (i + 1 === splitted.length - 1) {
        equalAdjacents.push(adjacent);
      }
    } else {
      if (adjacent.length > 1) {
        equalAdjacents.push(adjacent);
      }
      adjacent = "";
    }
  }

  if (!equalAdjacents.length) {
    return false;
  }

  return !!equalAdjacents.find(a => a.length === 2);
}

function digitsNonDecrease(num) {
  const splitted = num.toString().split("");
  for (let i = 0; i < splitted.length - 1; i++) {
    if (splitted[i + 1] < splitted[i]) {
      return false;
    }
  }

  return true;
}

const correctPasswords = [];

for (let n = MIN; n <= MAX; n++) {
  if (digitsNonDecrease(n) && hasExactlyTwoAdjacentEqualDigits(n)) {
    correctPasswords.push(n);
  }
}

console.log(correctPasswords.length);
// 324
