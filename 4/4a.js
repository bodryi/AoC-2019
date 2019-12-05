const MIN = 357253;
const MAX = 892942;

function hasTwoAdjacentEqualDigits(num) {
  const splitted = num.toString().split("");
  for (let i = 0; i < splitted.length - 1; i++) {
    if (splitted[i] === splitted[i + 1]) {
      return true;
    }
  }

  return false;
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
  if (digitsNonDecrease(n) && hasTwoAdjacentEqualDigits(n)) {
    correctPasswords.push(n);
  }
}

console.log(correctPasswords.length);
// 530
