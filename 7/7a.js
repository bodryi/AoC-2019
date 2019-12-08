const STEP_SIZE = 4;
const EXIT_CODE = 99;
const TEST_INPUT = 5;

const operations = {
  1: (program, index1, index2, resultIndex, opArray) => {
    try {
      const newData = [...program];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2]) +
          getValue(newData, index2, opArray[1]),
        opArray[0]
      );
      return newData;
    } catch (e) {
      throw new Error(`Addition error: ${e}`);
    }
  },
  2: (program, index1, index2, resultIndex, opArray) => {
    try {
      const newData = [...program];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2]) *
          getValue(newData, index2, opArray[1]),
        opArray[0]
      );
      return newData;
    } catch (e) {
      throw new Error(`Multiply error: ${e}`);
    }
  },
  3: (program, index, input, opArray) => {
    try {
      // getting input
      const newData = [...program];
      setValue(newData, index, input, opArray[0]);
      return newData;
    } catch (e) {
      throw new Error(`Input error: ${e}`);
    }
  },
  4: (program, index, opArray) => {
    // output
    return getValue(program, index, opArray[2]);
  },
  5: (program, index1, index2, indexToIncrease, opArray) => {
    const param = getValue(program, index1, opArray[2]);
    if (param) {
      indexToIncrease = getValue(program, index2, opArray[1]);
    } else {
      indexToIncrease += 3;
    }

    return indexToIncrease;
  },
  6: (program, index1, index2, indexToIncrease, opArray) => {
    const param = getValue(program, index1, opArray[2]);
    if (!param) {
      indexToIncrease = getValue(program, index2, opArray[1]);
    } else {
      indexToIncrease += 3;
    }

    return indexToIncrease;
  },
  7: (data, index1, index2, resultIndex, opArray) => {
    try {
      const newData = [...data];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2]) <
          getValue(newData, index2, opArray[1])
          ? 1
          : 0,
        opArray[0]
      );
      return newData;
    } catch (e) {
      throw new Error(`Less than error: ${e}`);
    }
  },
  8: (data, index1, index2, resultIndex, opArray) => {
    try {
      const newData = [...data];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2]) ===
          getValue(newData, index2, opArray[1])
          ? 1
          : 0,
        opArray[0]
      );
      return newData;
    } catch (e) {
      throw new Error(`Less than error: ${e}`);
    }
  }
};

function getOpCodeArray(op) {
  const opArray = op
    .toString()
    .split("")
    .map(n => +n);
  const length = opArray.length;
  if (length < 5) {
    for (let i = 0; i < 5 - length; i++) {
      opArray.unshift(0);
    }
  }

  return opArray;
}

function getValue(program, index, mode) {
  return +mode ? index : program[index];
}

function setValue(program, index, value, mode) {
  if (+mode) {
    program[index] = value;
  } else {
    program[index] = value;
  }
}

function stepForward(index, step = STEP_SIZE) {
  return index + step;
}

function runProgram(program, phase, input) {
  let currentIndex = 0;
  let currentInput = phase;
  let out;
  while (program[currentIndex] !== EXIT_CODE) {
    const operationArray = getOpCodeArray(program[currentIndex]);
    const operation = operationArray[operationArray.length - 1];
    switch (operation) {
      case 1:
      case 2:
      case 7:
      case 8: {
        // math
        program = operations[operation](
          program,
          program[currentIndex + 1],
          program[currentIndex + 2],
          program[currentIndex + 3],
          operationArray
        );
        currentIndex = stepForward(currentIndex);
        break;
      }
      case 3: {
        program = operations[operation](
          program,
          program[currentIndex + 1],
          currentInput,
          operationArray
        );
        currentIndex = stepForward(currentIndex, 2);
        currentInput = input;
        break;
      }
      case 4: {
        out = operations[operation](
          program,
          program[currentIndex + 1],
          operationArray
        );
        currentIndex = stepForward(currentIndex, 2);

        // speed up because of skipping the rest of programm
        // return out; 
        break;
      }
      case 5:
      case 6: {
        currentIndex = operations[operation](
          program,
          program[currentIndex + 1],
          program[currentIndex + 2],
          currentIndex,
          operationArray
        );
        break;
      }
    }
  }

  return out;
}

function runSequenceTest(prog, sequence) {
  let input = 0;
  let output;
  for (let i = 0; i < sequence.length; i++) {
    output = runProgram(prog, sequence[i], input);
    input = output;
  }

  return output;
}

function getSequences(
  elementsSet,
  size,
  resSquences,
  sequence = [],
  start = 0,
  index = 0
) {
  if (index === size) {
    resSquences.push([...sequence]);
    return;
  }
  const end = elementsSet.length - 1;
  for (let i = start; i <= end && end - i + 1 >= size - index; i++) {
    sequence[index] = elementsSet[i];
    getSequences(elementsSet, size, resSquences, sequence, i + 1, index + 1);
  }
}

function nextPermutation(sequence) {
  let i = sequence.length;
  do {
    if (i < 2) {
      return false;
    }
    --i;
  } while (!(sequence[i - 1] < sequence[i]));

  let j = sequence.length;
  while (i < j && !(sequence[i - 1] < sequence[--j]));
  swap(sequence, i - 1, j);

  j = sequence.length;
  while (i < --j) {
    swap(sequence, i++, j);
  }

  return sequence;
}

function swap(sequence, index1, index2) {
  const temp = sequence[index1];
  sequence[index1] = sequence[index2];
  sequence[index2] = temp;
}

function getAllPermutations(sequence) {
  const res = [[...sequence]];
  const permutation = [...sequence];
  while (true) {
    const p = nextPermutation(permutation);
    if (p) {
      res.push([...p]);
    } else break;
  }
  return res;
}

const data = `3,8,1001,8,10,8,105,1,0,0,21,34,51,68,89,98,179,260,341,422,99999,3,9,1001,9,4,9,102,4,9,9,4,9,99,3,9,1002,9,5,9,1001,9,2,9,1002,9,2,9,4,9,99,3,9,1001,9,3,9,102,3,9,9,101,4,9,9,4,9,99,3,9,102,2,9,9,101,2,9,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99`
  .split(",")
  .map(n => +n);

const sequences = [];
getSequences([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5, sequences);
const allSequences = sequences
  .map(seq => getAllPermutations(seq))
  .reduce((acc, curr) => acc.concat(curr), []);

let maxOuput = 0;
for (let i = 0; i < allSequences.length; i++) {
  const res = runSequenceTest([...data], allSequences[i]);
  if (res > maxOuput) {
    maxOuput = res;
  }
}

console.log(maxOuput);