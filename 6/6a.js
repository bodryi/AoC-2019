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

console.log(ds(orbitsTree, orbitsTree[0]));
