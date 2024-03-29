const STEP_SIZE = 4;
const EXIT_CODE = 99;

const operations = {
  1: (program, index1, index2, resultIndex, opArray, relativeBase) => {
    try {
      const newData = [...program];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2], relativeBase) +
          getValue(newData, index2, opArray[1], relativeBase),
        opArray[0],
        relativeBase
      );
      return newData;
    } catch (e) {
      throw new Error(`Addition error: ${e}`);
    }
  },
  2: (program, index1, index2, resultIndex, opArray, relativeBase) => {
    try {
      const newData = [...program];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2], relativeBase) *
          getValue(newData, index2, opArray[1], relativeBase),
        opArray[0],
        relativeBase
      );
      return newData;
    } catch (e) {
      throw new Error(`Multiply error: ${e}`);
    }
  },
  3: (program, index, input, opArray, relativeBase) => {
    try {
      // getting input
      const newData = [...program];
      setValue(newData, index, input, opArray[2], relativeBase);
      return newData;
    } catch (e) {
      throw new Error(`Input error: ${e}`);
    }
  },
  4: (program, index, opArray, relativeBase) => {
    // output
    return getValue(program, index, opArray[2], relativeBase);
  },
  5: (program, index1, index2, indexToIncrease, opArray, relativeBase) => {
    const param = getValue(program, index1, opArray[2], relativeBase);
    if (param) {
      indexToIncrease = getValue(program, index2, opArray[1], relativeBase);
    } else {
      indexToIncrease += 3;
    }

    return indexToIncrease;
  },
  6: (program, index1, index2, indexToIncrease, opArray, relativeBase) => {
    const param = getValue(program, index1, opArray[2], relativeBase);
    if (!param) {
      indexToIncrease = getValue(program, index2, opArray[1], relativeBase);
    } else {
      indexToIncrease += 3;
    }

    return indexToIncrease;
  },
  7: (data, index1, index2, resultIndex, opArray, relativeBase) => {
    try {
      const newData = [...data];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2], relativeBase) <
          getValue(newData, index2, opArray[1], relativeBase)
          ? 1
          : 0,
        opArray[0],
        relativeBase
      );
      return newData;
    } catch (e) {
      throw new Error(`Less than error: ${e}`);
    }
  },
  8: (data, index1, index2, resultIndex, opArray, relativeBase) => {
    try {
      const newData = [...data];
      setValue(
        newData,
        resultIndex,
        getValue(newData, index1, opArray[2], relativeBase) ===
          getValue(newData, index2, opArray[1], relativeBase)
          ? 1
          : 0,
        opArray[0],
        relativeBase
      );
      return newData;
    } catch (e) {
      throw new Error(`Less than error: ${e}`);
    }
  },
  9: (program, index, opArray, relativeBase) => {
    return relativeBase + getValue(program, index, opArray[2], relativeBase);
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

function getValue(program, index, mode, relativeBase) {
  switch (+mode) {
    case 0: {
      if (index < 0) {
        throw new Error("getValue: index is less than 0");
      }
      const result = program[index];

      return !result && result !== 0 ? 0 : result;
    }
    case 1:
      return index;
    case 2: {
      if (index + relativeBase < 0) {
        throw new Error("getValue: index is less than 0");
      }
      const result = program[index + relativeBase];
      return !result && result !== 0 ? 0 : result;
    }
  }
}

function setValue(program, index, value, mode, relativeBase) {
  switch (+mode) {
    case 0:
    case 1: {
      if (index < 0) {
        throw new Error("setValue: index is less than 0");
      }
      if (program.length < index) {
        const length = program.length;
        for (let i = 0; i < index - length; i++) {
          program.push(0);
        }
      }
      program[index] = value;
      break;
    }
    case 2: {
      if (index + relativeBase < 0) {
        throw new Error("setValue: index is less than 0");
      }
      if (program.length < index + relativeBase) {
        const length = program.length;
        for (let i = 0; i < index + relativeBase - length; i++) {
          program.push(0);
        }
      }
      program[index + relativeBase] = value;
      break;
    }
  }
}

function stepForward(index, step = STEP_SIZE) {
  return index + step;
}

function runProgram(program, input) {
  let currentIndex = 0;
  let relativeBase = 0;
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
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex);
        break;
      }
      case 3: {
        program = operations[operation](
          program,
          program[currentIndex + 1],
          input,
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex, 2);
        break;
      }
      case 4: {
        out = operations[operation](
          program,
          program[currentIndex + 1],
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex, 2);
        console.log(out);
        break;
      }
      case 5:
      case 6: {
        currentIndex = operations[operation](
          program,
          program[currentIndex + 1],
          program[currentIndex + 2],
          currentIndex,
          operationArray,
          relativeBase
        );
        break;
      }
      case 9: {
        relativeBase = operations[operation](
          program,
          program[currentIndex + 1],
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex, 2);
      }
    }
  }

  return out;
}

const data = "1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,0,3,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,0,38,1019,1102,1,37,1008,1101,252,0,1023,1102,24,1,1004,1102,35,1,1017,1101,0,28,1011,1101,0,36,1003,1102,30,1,1013,1101,0,0,1020,1102,1,1,1021,1102,897,1,1028,1101,20,0,1000,1101,0,22,1005,1102,29,1,1007,1101,0,34,1009,1102,1,259,1022,1101,310,0,1025,1102,892,1,1029,1101,21,0,1014,1102,1,315,1024,1101,0,33,1002,1102,31,1,1015,1102,190,1,1027,1102,1,39,1001,1101,26,0,1010,1101,27,0,1016,1102,1,23,1018,1101,0,32,1012,1101,0,25,1006,1102,1,197,1026,109,34,2106,0,-7,1001,64,1,64,1106,0,199,4,187,1002,64,2,64,109,-22,2108,34,-3,63,1005,63,221,4,205,1001,64,1,64,1106,0,221,1002,64,2,64,109,-10,1208,-1,42,63,1005,63,237,1106,0,243,4,227,1001,64,1,64,1002,64,2,64,109,20,2105,1,1,1001,64,1,64,1105,1,261,4,249,1002,64,2,64,109,1,21108,40,40,-6,1005,1017,283,4,267,1001,64,1,64,1105,1,283,1002,64,2,64,109,7,1205,-9,301,4,289,1001,64,1,64,1105,1,301,1002,64,2,64,109,-1,2105,1,-5,4,307,1106,0,319,1001,64,1,64,1002,64,2,64,109,-8,1206,0,331,1105,1,337,4,325,1001,64,1,64,1002,64,2,64,109,-6,21108,41,38,0,1005,1015,353,1105,1,359,4,343,1001,64,1,64,1002,64,2,64,109,11,1206,-6,377,4,365,1001,64,1,64,1106,0,377,1002,64,2,64,109,1,21101,42,0,-8,1008,1019,42,63,1005,63,399,4,383,1105,1,403,1001,64,1,64,1002,64,2,64,109,-29,1202,6,1,63,1008,63,24,63,1005,63,425,4,409,1106,0,429,1001,64,1,64,1002,64,2,64,109,14,1201,-3,0,63,1008,63,34,63,1005,63,451,4,435,1105,1,455,1001,64,1,64,1002,64,2,64,109,10,21101,43,0,-9,1008,1013,41,63,1005,63,475,1106,0,481,4,461,1001,64,1,64,1002,64,2,64,109,-17,2101,0,0,63,1008,63,21,63,1005,63,501,1106,0,507,4,487,1001,64,1,64,1002,64,2,64,109,-5,2107,21,5,63,1005,63,525,4,513,1105,1,529,1001,64,1,64,1002,64,2,64,109,13,1202,-7,1,63,1008,63,26,63,1005,63,553,1001,64,1,64,1106,0,555,4,535,1002,64,2,64,109,5,21107,44,45,-8,1005,1010,573,4,561,1105,1,577,1001,64,1,64,1002,64,2,64,109,-6,21102,45,1,7,1008,1019,45,63,1005,63,603,4,583,1001,64,1,64,1105,1,603,1002,64,2,64,109,-15,1207,10,28,63,1005,63,623,1001,64,1,64,1106,0,625,4,609,1002,64,2,64,109,8,2108,37,-4,63,1005,63,645,1001,64,1,64,1105,1,647,4,631,1002,64,2,64,109,6,21102,46,1,1,1008,1012,44,63,1005,63,671,1001,64,1,64,1106,0,673,4,653,1002,64,2,64,109,4,1207,-6,35,63,1005,63,695,4,679,1001,64,1,64,1106,0,695,1002,64,2,64,109,1,2107,38,-8,63,1005,63,715,1001,64,1,64,1105,1,717,4,701,1002,64,2,64,109,-23,1208,10,36,63,1005,63,739,4,723,1001,64,1,64,1105,1,739,1002,64,2,64,109,4,2102,1,7,63,1008,63,24,63,1005,63,765,4,745,1001,64,1,64,1105,1,765,1002,64,2,64,109,13,2102,1,-4,63,1008,63,22,63,1005,63,789,1001,64,1,64,1105,1,791,4,771,1002,64,2,64,109,-8,1201,5,0,63,1008,63,32,63,1005,63,811,1106,0,817,4,797,1001,64,1,64,1002,64,2,64,109,11,1205,7,829,1105,1,835,4,823,1001,64,1,64,1002,64,2,64,109,-1,2101,0,-6,63,1008,63,25,63,1005,63,857,4,841,1106,0,861,1001,64,1,64,1002,64,2,64,109,8,21107,47,46,-9,1005,1011,877,1106,0,883,4,867,1001,64,1,64,1002,64,2,64,109,9,2106,0,-1,4,889,1106,0,901,1001,64,1,64,4,64,99,21101,0,27,1,21102,915,1,0,1105,1,922,21201,1,59500,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21101,0,942,0,1105,1,922,21201,1,0,-1,21201,-2,-3,1,21101,0,957,0,1105,1,922,22201,1,-1,-2,1105,1,968,21201,-2,0,-2,109,-3,2105,1,0"
  .split(",")
  .map(n => +n);

runProgram([...data], 2);
