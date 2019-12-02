const STEP_SIZE = 4;
const EXIT_CODE = 99;
const SEARCH_VALUE = 19690720;
const operations = {
  1: (data, index1, index2, resultIndex) => {
    try {
      const newData = [...data];
      newData[resultIndex] = newData[index1] + newData[index2];
      return newData;
    } catch (e) {
      throw new Error(`Addition error: ${e}`);
    }
  },
  2: (data, index1, index2, resultIndex) => {
    try {
      const newData = [...data];
      newData[resultIndex] = newData[index1] * newData[index2];
      return newData;
    } catch (e) {
      throw new Error(`Addition error: ${e}`);
    }
  }
};

function stepForward(index) {
  return index + STEP_SIZE;
}

const data = [
  1,
  12, //0,
  2, //0,
  3,
  1,
  1,
  2,
  3,
  1,
  3,
  4,
  3,
  1,
  5,
  0,
  3,
  2,
  10,
  1,
  19,
  1,
  19,
  9,
  23,
  1,
  23,
  6,
  27,
  1,
  9,
  27,
  31,
  1,
  31,
  10,
  35,
  2,
  13,
  35,
  39,
  1,
  39,
  10,
  43,
  1,
  43,
  9,
  47,
  1,
  47,
  13,
  51,
  1,
  51,
  13,
  55,
  2,
  55,
  6,
  59,
  1,
  59,
  5,
  63,
  2,
  10,
  63,
  67,
  1,
  67,
  9,
  71,
  1,
  71,
  13,
  75,
  1,
  6,
  75,
  79,
  1,
  10,
  79,
  83,
  2,
  9,
  83,
  87,
  1,
  87,
  5,
  91,
  2,
  91,
  9,
  95,
  1,
  6,
  95,
  99,
  1,
  99,
  5,
  103,
  2,
  103,
  10,
  107,
  1,
  107,
  6,
  111,
  2,
  9,
  111,
  115,
  2,
  9,
  115,
  119,
  2,
  13,
  119,
  123,
  1,
  123,
  9,
  127,
  1,
  5,
  127,
  131,
  1,
  131,
  2,
  135,
  1,
  135,
  6,
  0,
  99,
  2,
  0,
  14,
  0
];

function nounVerbTest(data, noun, verb) {
  let program = [...data];
  program[1] = noun;
  program[2] = verb;
  let currentIndex = 0;
  while (data[currentIndex] !== EXIT_CODE) {
    const operation = data[currentIndex];
    program = operations[operation](
      program,
      program[currentIndex + 1],
      program[currentIndex + 2],
      program[currentIndex + 3]
    );

    currentIndex = stepForward(currentIndex);
  }

  return program[0];
}

let isBreak = false;
let result = [];
for (let i = 0; i < 100; i++) {
  for (let k = 0; k < 100; k++) {
    const res = nounVerbTest(data, k, i);
    if (res === SEARCH_VALUE) {
      result = [k, i];
      isBreak = true;
      break;
    }
  }
  if (isBreak) {
    break;
  }
}

console.log(100 * result[0] + result[1]);
