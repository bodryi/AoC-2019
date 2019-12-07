const data = require("./6a.input");

function ds(tree, node, counter = 0, gen = 0) {
  counter = counter + gen;
  if (!node.children.length) {
    return counter;
  } else {
    node.children.forEach(n => {
      counter = ds(
        tree,
        tree.find(treeNode => treeNode.value === n),
        counter,
        gen + 1
      );
    });
  }

  return counter;
}

function searchPath(tree, start, goal, path = [], closed = [], child = false) {
  path.push(start.value);
  closed.push(start);
  if (start.value === goal.value) {
    return { path, success: true };
  } else {
    const parentsNames = !child
      ? tree
          .filter(n => n.children.find(ch => ch === start.value))
          .map(n => ({ value: n.value, child: false }))
      : [];
    const nodesToSearch = [
      ...start.children.map(n => ({ value: n, child: true })),
      ...parentsNames
    ].filter(name => !closed.find(n => n.value === name.value));
    for (let i = 0; i < nodesToSearch.length; i++) {
      const res = searchPath(
        tree,
        tree.find(treeNode => treeNode.value === nodesToSearch[i].value),
        goal,
        path,
        closed,
        nodesToSearch[i].child
      );
      if (res.success) {
        return res;
      }
    }
  }

  path.pop();

  return { path, success: false };
}

const orbitsMap = data.split("\n").map(item => item.split(")"));

const orbitsTree = [];
orbitsMap.forEach(item => {
  const nodeIndex = orbitsTree.findIndex(n => n.value === item[0]);
  if (nodeIndex > -1) {
    orbitsTree[nodeIndex].children.push(item[1]);
  } else {
    orbitsTree.push({ value: item[0], children: [item[1]] });
  }
  orbitsTree.push({ value: item[1], children: [] });
});

const rootIndex = orbitsTree.findIndex(n => n.value === "COM");
[orbitsTree[0], orbitsTree[rootIndex]] = [orbitsTree[rootIndex], orbitsTree[0]];

const foundPath = searchPath(
  orbitsTree,
  orbitsTree.find(n => n.value === "YOU"),
  orbitsTree.find(n => n.value === "SAN")
);

console.log(foundPath.path.length - 3);
