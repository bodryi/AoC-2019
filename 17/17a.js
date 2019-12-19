const STEP_SIZE = 4;
const EXIT_CODE = 99;

const directions = {
  UP: "^",
  DOWN: "v",
  LEFT: "<",
  RIGHT: ">",
  UNCONTROLLABLE: "X"
};

const blocks = {
  SCAFFOLD: "#",
  OPEN_SPACE: "."
};

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

function runProgram(program) {
  let currentIndex = 0;
  let relativeBase = 0;
  let out = "";
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
        const output = operations[operation](
          program,
          program[currentIndex + 1],
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex, 2);
        out += convertOutput(output);
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

function convertOutput(output) {
  return String.fromCharCode(output);
}

const data = "1,330,331,332,109,4278,1101,0,1182,16,1102,1485,1,24,102,1,0,570,1006,570,36,102,1,571,0,1001,570,-1,570,1001,24,1,24,1105,1,18,1008,571,0,571,1001,16,1,16,1008,16,1485,570,1006,570,14,21102,1,58,0,1105,1,786,1006,332,62,99,21101,0,333,1,21101,0,73,0,1106,0,579,1101,0,0,572,1102,1,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1002,574,1,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1105,1,81,21102,340,1,1,1105,1,177,21102,477,1,1,1106,0,177,21102,514,1,1,21101,0,176,0,1105,1,579,99,21102,184,1,0,1105,1,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1002,572,1,1182,21101,0,375,1,21102,1,211,0,1105,1,579,21101,1182,11,1,21101,222,0,0,1106,0,979,21102,1,388,1,21101,0,233,0,1105,1,579,21101,1182,22,1,21101,244,0,0,1106,0,979,21101,401,0,1,21102,1,255,0,1105,1,579,21101,1182,33,1,21101,0,266,0,1106,0,979,21101,414,0,1,21101,277,0,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21101,0,1182,1,21102,1,313,0,1105,1,622,1005,575,327,1101,0,1,575,21102,1,327,0,1106,0,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,24,26,0,109,4,1201,-3,0,587,20102,1,0,-1,22101,1,-3,-3,21102,1,0,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1105,1,597,109,-4,2105,1,0,109,5,2102,1,-4,629,21001,0,0,-2,22101,1,-4,-4,21101,0,0,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,653,20102,1,0,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21102,1,702,0,1106,0,786,21201,-1,-1,-1,1105,1,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21102,731,1,0,1106,0,786,1105,1,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21101,0,756,0,1106,0,786,1105,1,774,21202,-1,-11,1,22101,1182,1,1,21101,774,0,0,1106,0,622,21201,-3,1,-3,1105,1,640,109,-5,2106,0,0,109,7,1005,575,802,21002,576,1,-6,21001,577,0,-5,1106,0,814,21101,0,0,-1,21102,0,1,-5,21102,1,0,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,57,-3,22201,-6,-3,-3,22101,1485,-3,-3,1202,-3,1,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21102,1,1,-1,1105,1,924,1205,-2,873,21101,35,0,-4,1105,1,924,2101,0,-3,878,1008,0,1,570,1006,570,916,1001,374,1,374,1202,-3,1,895,1101,0,2,0,2101,0,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,922,20101,0,0,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,57,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,49,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1101,1,0,575,21101,973,0,0,1106,0,786,99,109,-7,2105,1,0,109,6,21102,1,0,-4,21102,0,1,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1105,1,1041,21102,-4,1,-2,1106,0,1041,21102,1,-5,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,1202,-2,1,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,1202,-2,1,0,1106,0,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1105,1,989,21102,1,439,1,1106,0,1150,21102,1,477,1,1105,1,1150,21102,1,514,1,21102,1,1149,0,1106,0,579,99,21101,0,1157,0,1106,0,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,1202,-5,1,1176,2101,0,-4,0,109,-6,2106,0,0,14,11,46,1,9,1,46,1,9,1,46,1,9,1,46,1,9,1,46,1,9,1,46,1,9,1,46,1,9,1,44,13,44,1,1,1,54,1,1,1,54,1,1,1,54,1,1,9,46,1,9,1,46,1,9,1,46,1,9,1,46,1,9,1,11,13,22,1,9,1,11,1,11,1,22,1,9,1,11,1,9,11,14,1,9,1,11,1,9,1,1,1,7,1,14,9,1,1,11,1,9,1,1,1,7,1,22,1,1,1,11,1,9,1,1,1,7,1,22,1,1,1,11,1,9,1,1,1,7,1,22,1,1,1,11,1,9,1,1,1,7,1,22,1,1,13,9,1,1,1,7,1,22,1,23,1,1,1,7,1,14,13,19,13,12,1,7,1,25,1,7,1,1,1,12,1,7,1,25,9,1,1,12,1,7,1,35,1,12,1,7,1,35,1,12,1,7,1,35,1,8,13,35,1,8,1,3,1,43,14,43,2,7,1,47,2,7,1,37,9,1,2,7,1,37,1,7,1,1,2,7,1,35,14,7,1,35,1,1,1,7,1,2,1,7,1,35,1,1,1,7,1,2,1,7,1,35,1,1,1,7,1,2,1,7,1,35,1,1,1,7,1,2,1,7,1,35,1,1,1,7,1,2,9,35,1,1,1,7,1,46,1,1,1,7,1,46,11,48,1,44,13,10"
  .split(",")
  .map(n => +n);

const map = runProgram([...data], 1);
const parsedMap = map
  .split("\n")
  .map((str, strIndex) =>
    str
      .split("")
      .map((el, colIndex) => ({ value: el, x: colIndex, y: strIndex }))
  )
  .filter(str => str.length);
const crossroads = [];
for (let i = 1; i < parsedMap.length - 1; i++) {
  for (let j = 1; j < parsedMap[i].length - 1; j++) {
    if (
      parsedMap[i][j].value === blocks.SCAFFOLD &&
      parsedMap[i][j + 1].value === blocks.SCAFFOLD &&
      parsedMap[i][j - 1].value === blocks.SCAFFOLD &&
      parsedMap[i - 1][j].value === blocks.SCAFFOLD &&
      parsedMap[i + 1][j].value === blocks.SCAFFOLD
    ) {
      crossroads.push({ ...parsedMap[i][j] });
    }
  }
}
const res = crossroads.reduce((acc, curr) => acc + curr.x * curr.y, 0);
console.log(res);
