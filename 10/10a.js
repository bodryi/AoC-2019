const input =
  ".#....#.###.........#..##.###.#.....##...\n" +
  "...........##.......#.#...#...#..#....#..\n" +
  "...#....##..##.......#..........###..#...\n" +
  "....#....####......#..#.#........#.......\n" +
  "...............##..#....#...##..#...#..#.\n" +
  "..#....#....#..#.....#.#......#..#...#...\n" +
  ".....#.#....#.#...##.........#...#.......\n" +
  "#...##.#.#...#.......#....#........#.....\n" +
  "....##........#....#..........#.......#..\n" +
  "..##..........##.....#....#.........#....\n" +
  "...#..##......#..#.#.#...#...............\n" +
  "..#.##.........#...#.#.....#........#....\n" +
  "#.#.#.#......#.#...##...#.........##....#\n" +
  ".#....#..#.....#.#......##.##...#.......#\n" +
  "..#..##.....#..#.........#...##.....#..#.\n" +
  "##.#...#.#.#.#.#.#.........#..#...#.##...\n" +
  ".#.....#......##..#.#..#....#....#####...\n" +
  "........#...##...#.....#.......#....#.#.#\n" +
  "#......#..#..#.#.#....##..#......###.....\n" +
  "............#..#.#.#....#.....##..#......\n" +
  "...#.#.....#..#.......#..#.#............#\n" +
  ".#.#.....#..##.....#..#..............#...\n" +
  ".#.#....##.....#......##..#...#......#...\n" +
  ".......#..........#.###....#.#...##.#....\n" +
  ".....##.#..#.....#.#.#......#...##..#.#..\n" +
  ".#....#...#.#.#.......##.#.........#.#...\n" +
  "##.........#............#.#......#....#..\n" +
  ".#......#.............#.#......#.........\n" +
  ".......#...##........#...##......#....#..\n" +
  "#..#.....#.#...##.#.#......##...#.#..#...\n" +
  "#....##...#.#........#..........##.......\n" +
  "..#.#.....#.....###.#..#.........#......#\n" +
  "......##.#...#.#..#..#.##..............#.\n" +
  ".......##.#..#.#.............#..#.#......\n" +
  "...#....##.##..#..#..#.....#...##.#......\n" +
  "#....#..#.#....#...###...#.#.......#.....\n" +
  ".#..#...#......##.#..#..#........#....#..\n" +
  "..#.##.#...#......###.....#.#........##..\n" +
  "#.##.###.........#...##.....#..#....#.#..\n" +
  "..........#...#..##..#..##....#.........#\n" +
  "..#..#....###..........##..#...#...#..#..";

const ASTEROID = "#";

function extractAsteroidsCoordinates(map) {
  const asteroidsCoords = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === ASTEROID) {
        asteroidsCoords.push({ x: j, y: i });
      }
    }
  }

  return asteroidsCoords;
}

function isPointBelongsToSection(sectionStart, sectionEnd, point) {
  if (
    Math.min(sectionStart.x, sectionEnd.x) <= point.x &&
    point.x <= Math.max(sectionStart.x, sectionEnd.x) &&
    Math.min(sectionStart.y, sectionEnd.y) <= point.y &&
    point.y <= Math.max(sectionStart.y, sectionEnd.y)
  ) {
    if (
      (sectionStart.x === sectionEnd.x && sectionEnd.x === point.x) ||
      (sectionStart.y === sectionEnd.y && sectionEnd.y === point.y)
    ) {
      return true;
    }

    const lhs = (point.x - sectionStart.x) / (sectionEnd.x - sectionStart.x);
    const rhs = (point.y - sectionStart.y) / (sectionEnd.y - sectionStart.y);

    return lhs === rhs;
  }

  return false;
}

function getVisibleAsteroidsCountMap(asteroids) {
  const asteroidsCountMap = new Array(asteroids.length).fill(0);
  for (
    let sectionStartIndex = 0;
    sectionStartIndex < asteroids.length;
    sectionStartIndex++
  ) {
    for (
      let sectionEndIndex = 0;
      sectionEndIndex < asteroids.length;
      sectionEndIndex++
    ) {
      if (sectionStartIndex === sectionEndIndex) {
        continue;
      }
      let isViewBlocked = false;
      for (
        let otherPointIndex = 0;
        otherPointIndex < asteroids.length;
        otherPointIndex++
      ) {
        let res =
          otherPointIndex !== sectionStartIndex &&
          otherPointIndex !== sectionEndIndex
            ? isPointBelongsToSection(
                asteroids[sectionStartIndex],
                asteroids[sectionEndIndex],
                asteroids[otherPointIndex]
              )
            : false;
        if (res) {
          isViewBlocked = true;
          break;
        }
      }

      if (!isViewBlocked) {
        asteroidsCountMap[sectionStartIndex]++;
      }
    }
  }

  return asteroidsCountMap;
}

const data = input.split("\n").map(line => line.split(""));
const asteroids = extractAsteroidsCoordinates(data);

console.log(
  getVisibleAsteroidsCountMap(asteroids).reduce(
    (max, curr) => (curr > max ? curr : max),
    0
  )
);
