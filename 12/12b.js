function updateVelocity(coordinate1, coordinate2) {
  return coordinate1 > coordinate2 ? -1 : coordinate1 === coordinate2 ? 0 : 1;
}

function applyGravity(moons) {
  const newMoonsData = [...moons];

  for (let i = 0; i < newMoonsData.length; i++) {
    for (let j = i + 1; j < newMoonsData.length; j++) {
      newMoonsData[i].vel.x += updateVelocity(
        newMoonsData[i].pos.x,
        newMoonsData[j].pos.x
      );
      newMoonsData[j].vel.x += updateVelocity(
        newMoonsData[j].pos.x,
        newMoonsData[i].pos.x
      );
      newMoonsData[i].vel.y += updateVelocity(
        newMoonsData[i].pos.y,
        newMoonsData[j].pos.y
      );
      newMoonsData[j].vel.y += updateVelocity(
        newMoonsData[j].pos.y,
        newMoonsData[i].pos.y
      );
      newMoonsData[i].vel.z += updateVelocity(
        newMoonsData[i].pos.z,
        newMoonsData[j].pos.z
      );
      newMoonsData[j].vel.z += updateVelocity(
        newMoonsData[j].pos.z,
        newMoonsData[i].pos.z
      );
    }
  }

  return newMoonsData;
}

function applyVelocity(moons) {
  const newMoonsData = [...moons];

  for (let i = 0; i < newMoonsData.length; i++) {
    newMoonsData[i].pos.x += newMoonsData[i].vel.x;
    newMoonsData[i].pos.y += newMoonsData[i].vel.y;
    newMoonsData[i].pos.z += newMoonsData[i].vel.z;
  }

  return newMoonsData;
}

function compareStatesCoordinate(state1, state2, coordinate) {
  if (state1.length !== state2.length) {
    return false;
  }
  for (let i = 0; i < state1.length; i++) {
    if (
      !(
        state1[i].pos[coordinate] === state2[i].pos[coordinate] &&
        state1[i].pos[coordinate] === state2[i].pos[coordinate] &&
        state1[i].pos[coordinate] === state2[i].pos[coordinate]
      )
    ) {
      return false;
    }
  }
  return true;
}

function copy(moons) {
  return JSON.parse(JSON.stringify(moons));
}

function gcd(a, b) {
  if (!a) return b;
  return gcd(b % a, a);
}

const data =
  "<x=-4, y=3, z=15>\n" +
  "<x=-11, y=-10, z=13>\n" +
  "<x=2, y=2, z=18>\n" +
  "<x=7, y=-1, z=0>";
let moons = data.split("\n").map(dataStr => {
  const betweenQuotes = dataStr.match(/<(.*?)>/)[1];
  const coords = betweenQuotes.split(",").map(coord => coord.split("=")[1]);
  return {
    pos: { x: +coords[0], y: +coords[1], z: +coords[2] },
    vel: { x: 0, y: 0, z: 0 }
  };
});

let initialState = copy(moons);
let step = 0;
const coordinatesEqualToInitial = {
  x: { steps: [] },
  y: { steps: [] },
  z: { steps: [] }
};

while (true) {
  step++;
  moons = applyGravity(moons);
  moons = applyVelocity(moons);

  if (
    compareStatesCoordinate(moons, initialState, "x") &&
    coordinatesEqualToInitial.x.steps.length < 2
  ) {
    coordinatesEqualToInitial.x.steps.push(step);
  }
  if (
    compareStatesCoordinate(moons, initialState, "y") &&
    coordinatesEqualToInitial.y.steps.length < 2
  ) {
    coordinatesEqualToInitial.y.steps.push(step);
  }
  if (
    compareStatesCoordinate(moons, initialState, "z") &&
    coordinatesEqualToInitial.z.steps.length < 2
  ) {
    coordinatesEqualToInitial.z.steps.push(step);
  }
  if (
    coordinatesEqualToInitial.x.steps.length === 2 &&
    coordinatesEqualToInitial.y.steps.length === 2 &&
    coordinatesEqualToInitial.z.steps.length === 2
  ) {
    break;
  }
}
const stepsForEachCoordinate = [
  coordinatesEqualToInitial.x.steps,
  coordinatesEqualToInitial.y.steps,
  coordinatesEqualToInitial.z.steps
];

for (let i = 0; i < stepsForEachCoordinate[0].length; i++) {
  for (let j = 0; j < stepsForEachCoordinate[1].length; j++) {
    for (let k = 0; k < stepsForEachCoordinate[2].length; k++) {
      // Find LCM for all triples and get the least of them
      console.log(
        stepsForEachCoordinate[0][i],
        stepsForEachCoordinate[1][j],
        stepsForEachCoordinate[2][k]
      );
    }
  }
}

// 292653556339368;
