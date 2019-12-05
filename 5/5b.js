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
  3: (program, index, opArray) => {
    try {
      // getting input
      const input = TEST_INPUT;
      const newData = [...program];
      setValue(newData, index, input, opArray[0]);
      return newData;
    } catch (e) {
      throw new Error(`Input error: ${e}`);
    }
  },
  4: (program, index, opArray) => {
    // output
    console.log(getValue(program, index, opArray[2]));
    return program;
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

const data = `3,225,1,225,6,6,1100,1,238,225,104,0,1101,11,91,225,1002,121,77,224,101,-6314,224,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1102,74,62,225,1102,82,7,224,1001,224,-574,224,4,224,102,8,223,223,1001,224,3,224,1,224,223,223,1101,28,67,225,1102,42,15,225,2,196,96,224,101,-4446,224,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,1101,86,57,225,1,148,69,224,1001,224,-77,224,4,224,102,8,223,223,1001,224,2,224,1,223,224,223,1101,82,83,225,101,87,14,224,1001,224,-178,224,4,224,1002,223,8,223,101,7,224,224,1,223,224,223,1101,38,35,225,102,31,65,224,1001,224,-868,224,4,224,1002,223,8,223,1001,224,5,224,1,223,224,223,1101,57,27,224,1001,224,-84,224,4,224,102,8,223,223,1001,224,7,224,1,223,224,223,1101,61,78,225,1001,40,27,224,101,-89,224,224,4,224,1002,223,8,223,1001,224,1,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1008,677,226,224,1002,223,2,223,1006,224,329,101,1,223,223,8,226,677,224,102,2,223,223,1005,224,344,101,1,223,223,1107,226,677,224,102,2,223,223,1006,224,359,101,1,223,223,1007,226,226,224,102,2,223,223,1006,224,374,101,1,223,223,7,677,677,224,102,2,223,223,1005,224,389,1001,223,1,223,108,677,677,224,1002,223,2,223,1005,224,404,101,1,223,223,1008,226,226,224,102,2,223,223,1005,224,419,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,434,1001,223,1,223,1108,677,677,224,102,2,223,223,1006,224,449,1001,223,1,223,7,226,677,224,102,2,223,223,1005,224,464,101,1,223,223,1008,677,677,224,102,2,223,223,1005,224,479,101,1,223,223,1007,226,677,224,1002,223,2,223,1006,224,494,101,1,223,223,8,677,226,224,1002,223,2,223,1005,224,509,101,1,223,223,1007,677,677,224,1002,223,2,223,1006,224,524,101,1,223,223,107,226,226,224,102,2,223,223,1006,224,539,101,1,223,223,107,226,677,224,102,2,223,223,1005,224,554,1001,223,1,223,7,677,226,224,102,2,223,223,1006,224,569,1001,223,1,223,107,677,677,224,1002,223,2,223,1005,224,584,101,1,223,223,1107,677,677,224,102,2,223,223,1005,224,599,101,1,223,223,1108,226,677,224,102,2,223,223,1006,224,614,101,1,223,223,8,226,226,224,102,2,223,223,1006,224,629,101,1,223,223,108,226,677,224,102,2,223,223,1005,224,644,1001,223,1,223,108,226,226,224,102,2,223,223,1005,224,659,101,1,223,223,1108,677,226,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226`
  .split(",")
  .map(n => +n);

let program = [...data];
let currentIndex = 0;

while (program[currentIndex] !== EXIT_CODE) {
  const operationArray = getOpCodeArray(program[currentIndex]);
  const operation = operationArray[operationArray.length - 1];

  if (operation < 3 || (operation >= 7 && operation < 9)) {
    // math operation
    program = operations[operation](
      program,
      program[currentIndex + 1],
      program[currentIndex + 2],
      program[currentIndex + 3],
      operationArray
    );
    currentIndex = stepForward(currentIndex);
  } else if (operation >= 3 && operation < 5) {
    // i/o operation
    program = operations[operation](
      program,
      program[currentIndex + 1],
      operationArray
    );
    currentIndex = stepForward(currentIndex, 2);
  } else if (operation >= 5 && operation < 7) {
    currentIndex = operations[operation](
      program,
      program[currentIndex + 1],
      program[currentIndex + 2],
      currentIndex,
      operationArray
    );
  }
}
