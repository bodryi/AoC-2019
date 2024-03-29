const STEP_SIZE = 4;
const EXIT_CODE = 99;
const TEST_INPUT = 5;
const TEST_DATA =
  "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";

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
      setValue(newData, index, input, opArray[2]);
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

function runProgram(program, index, phase, input = null) {
  let currentIndex = index || 0;
  let currentInput = phase;
  let out;
  let gotOutput = false;
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
        if (gotOutput) {
          return { output: out, program, isHalt: false, index: currentIndex };
        }
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
        gotOutput = true;
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

  return { output: out, program, isHalt: true, index: currentIndex };
}

function runFeedbackLoop(programStates, indexesStates, sequence, input) {
  let i = 0;
  let output;
  while (true) {
    const res = runProgram(programStates[i], indexesStates[i], input);
    output = res.output;
    input = output;
    programStates[i] = res.program;
    indexesStates[i] = res.index;
    if (res.isHalt && i === sequence.length - 1) {
      return output;
    }

    i = (i + 1) % sequence.length;
  }
}

function runSequenceTest(prog, sequence) {
  let input = 0;
  let output;
  const programStates = new Array(sequence.length).fill([...prog]);
  const indexesStates = new Array(sequence.length).fill(0);
  for (let i = 0; i < sequence.length; i++) {
    const res = runProgram(
      programStates[i],
      indexesStates[i],
      sequence[i],
      input
    );
    output = res.output;
    programStates[i] = res.program;
    indexesStates[i] = res.index;
    input = output;
  }

  output = runFeedbackLoop(programStates, indexesStates, sequence, input);

  return output;
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

const allSequences = getAllPermutations([5, 6, 7, 8, 9]);

let maxOuput = 0;
for (let i = 0; i < allSequences.length; i++) {
  const res = runSequenceTest([...data], allSequences[i]);
  if (res > maxOuput) {
    maxOuput = res;
  }
}

console.log(maxOuput);
