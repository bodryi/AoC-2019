const BOUND = 100;

function phase(input, patternBase) {
  const result = [];
  for (let i = 0; i < input.length; i++) {
    const patternToApply = getPatternForElement(patternBase, i);
    patternToApply.push(patternToApply[0]);
    patternToApply.shift();
    result.push(
      Math.abs(
        input.reduce(
          (acc, curr, index) =>
            acc + curr * patternToApply[index % patternToApply.length],
          0
        ) % 10
      )
    );
  }
  return result;
}

function getPatternForElement(pattern, elementNumber) {
  return pattern
    .map(patternElement => new Array(elementNumber + 1).fill(patternElement))
    .flat();
}

const input = "59766977873078199970107568349014384917072096886862753001181795467415574411535593439580118271423936468093569795214812464528265609129756216554981001419093454383882560114421882354033176205096303121974045739484366182044891267778931831792562035297585485658843180220796069147506364472390622739583789825303426921751073753670825259141712329027078263584903642919122991531729298497467435911779410970734568708255590755424253797639255236759229935298472380039602200033415155467240682533288468148414065641667678718893872482168857631352275667414965503393341925955626006552556064728352731985387163635634298416016700583512112158756656289482437803808487304460165855189"
  .split("")
  .map(n => +n);
const pattern = [0, 1, 0, -1];
let res = [...input];
for (let i = 0; i < BOUND; i++) {
  res = phase(res, pattern);
}

console.log(res.slice(0, 8).join(""));
//27831665
