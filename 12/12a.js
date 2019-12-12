const STEPS = 1000;

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

function getTotalEnergy(moons) {
  let totalEnergy = 0;
  for (let i = 0; i < moons.length; i++) {
    const potential =
      Math.abs(moons[i].pos.x) +
      Math.abs(moons[i].pos.y) +
      Math.abs(moons[i].pos.z);
    const kinetic =
      Math.abs(moons[i].vel.x) +
      Math.abs(moons[i].vel.y) +
      Math.abs(moons[i].vel.z);
    totalEnergy += potential * kinetic;
  }
  return totalEnergy;
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

for (let i = 0; i < STEPS; i++) {
  moons = applyGravity(moons);
  moons = applyVelocity(moons);
}

const res = getTotalEnergy(moons);
console.log(res);
