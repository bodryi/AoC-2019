const STEP_SIZE = 4;
const EXIT_CODE = 99;
const directions = {
  DIRECTION_UP: 0,
  DIRECTION_LEFT: 1,
  DIRECTION_DOWN: 2,
  DIRECTION_RIGHT: 3
};

const colors = {
  BLACK: 0,
  WHITE: 1
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

function paintPlate(paintedPlates, [color, action]) {
  let coords = { ...paintedPlates.currentCoords };

  const alreadyWasPaintedIndex = paintedPlates.plates.findIndex(
    plate => plate.coords.x === coords.x && plate.coords.y === coords.y
  );
  if (alreadyWasPaintedIndex > -1) {
    paintedPlates.plates[alreadyWasPaintedIndex].color = color;
    paintedPlates.plates[alreadyWasPaintedIndex].counter++;
  } else {
    paintedPlates.plates.push({
      coords: { x: coords.x, y: coords.y },
      color,
      counter: 1
    });
  }

  paintedPlates.currentDirection = turnDirection(
    action,
    paintedPlates.currentDirection
  );

  paintedPlates.currentCoords = moveRobot(
    paintedPlates.currentCoords,
    paintedPlates.currentDirection
  );
  const alreadyWasPaintedIndexNext = paintedPlates.plates.findIndex(
    plate =>
      plate.coords.x === paintedPlates.currentCoords.x &&
      plate.coords.y === paintedPlates.currentCoords.y
  );
  if (alreadyWasPaintedIndexNext > -1) {
    paintedPlates.currentColor =
      paintedPlates.plates[alreadyWasPaintedIndexNext].color;
  } else {
    paintedPlates.currentColor = colors.BLACK;
  }
  paintedPlates.counter++;
  return paintedPlates;
}

function turnDirection(action, direction) {
  return !action
    ? (direction + 1) % 4
    : (direction - 1 < 0 ? direction - 1 + 4 : direction - 1) % 4;
}

function moveRobot(coords, direction) {
  switch (direction) {
    case directions.DIRECTION_UP:
      return { ...coords, y: coords.y + 1 };
    case directions.DIRECTION_LEFT:
      return { ...coords, x: coords.x - 1 };
    case directions.DIRECTION_DOWN:
      return { ...coords, y: coords.y - 1 };
    case directions.DIRECTION_RIGHT:
      return { ...coords, x: coords.x + 1 };
  }
}

function runProgram(program) {
  let currentIndex = 0;
  let relativeBase = 0;
  let outPair = [];
  let paintedPlates = {
    plates: [],
    currentCoords: { x: 0, y: 0 },
    currentDirection: directions.DIRECTION_UP,
    currentColor: colors.BLACK,
    counter: 0
  };
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
          paintedPlates.currentColor,
          operationArray,
          relativeBase
        );
        currentIndex = stepForward(currentIndex, 2);
        break;
      }
      case 4: {
        const newOut = operations[operation](
          program,
          program[currentIndex + 1],
          operationArray,
          relativeBase
        );
        if (outPair.length === 1) {
          outPair.push(newOut);
          paintedPlates = paintPlate({ ...paintedPlates }, outPair);
        } else {
          outPair = [newOut];
        }
        currentIndex = stepForward(currentIndex, 2);
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

  return paintedPlates;
}

const data = "3,8,1005,8,310,1106,0,11,0,0,0,104,1,104,0,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,29,1,2,11,10,1,1101,2,10,2,1008,18,10,2,106,3,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,67,2,105,15,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,93,2,1001,16,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,119,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,141,2,7,17,10,1,1103,16,10,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,170,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,1002,8,1,193,1,7,15,10,2,105,13,10,1006,0,92,1006,0,99,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,101,0,8,228,1,3,11,10,1006,0,14,1006,0,71,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,101,0,8,261,2,2,2,10,1006,0,4,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,289,101,1,9,9,1007,9,1049,10,1005,10,15,99,109,632,104,0,104,1,21101,0,387240009756,1,21101,327,0,0,1105,1,431,21101,0,387239486208,1,21102,1,338,0,1106,0,431,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,3224472579,1,1,21101,0,385,0,1106,0,431,21101,0,206253952003,1,21102,396,1,0,1105,1,431,3,10,104,0,104,0,3,10,104,0,104,0,21102,709052072296,1,1,21102,419,1,0,1105,1,431,21102,1,709051962212,1,21102,430,1,0,1106,0,431,99,109,2,21202,-1,1,1,21102,1,40,2,21102,462,1,3,21102,452,1,0,1105,1,495,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,457,458,473,4,0,1001,457,1,457,108,4,457,10,1006,10,489,1101,0,0,457,109,-2,2105,1,0,0,109,4,2102,1,-1,494,1207,-3,0,10,1006,10,512,21101,0,0,-3,22101,0,-3,1,21202,-2,1,2,21102,1,1,3,21101,531,0,0,1105,1,536,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,559,2207,-4,-2,10,1006,10,559,21202,-4,1,-4,1105,1,627,22102,1,-4,1,21201,-3,-1,2,21202,-2,2,3,21102,1,578,0,1105,1,536,21202,1,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,597,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,619,21201,-1,0,1,21102,1,619,0,106,0,494,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0"
  .split(",")
  .map(n => +n);

const res = runProgram([...data]);
console.log(res.plates.length);
