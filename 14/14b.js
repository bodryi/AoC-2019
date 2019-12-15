const TRILLION = 1000000000000;
const extraChemicals = {};

function getRatio(wantedQuantity, canBeProducedQuantity) {
  return Math.ceil(wantedQuantity / canBeProducedQuantity);
}

function getOrePerChemical(reactions, chemicalName, quantity = 1) {
  const reaction = reactions.find(r => r.result.chemical === chemicalName);
  const extraExisting = extraChemicals[chemicalName] || 0;
  const ratio = getRatio(
    Math.max(quantity - extraExisting, 0),
    reaction.result.quantity
  );
  const extra = ratio * reaction.result.quantity - (quantity - extraExisting);

  if (chemicalName !== "ORE") {
    extraChemicals[chemicalName] = extra;
  }

  let oreQuantity = 0;
  for (let i = 0; i < reaction.components.length; i++) {
    const component = reaction.components[i];
    oreQuantity +=
      component.chemical === "ORE"
        ? ratio * component.quantity
        : getOrePerChemical(
            reactions,
            component.chemical,
            ratio * component.quantity
          );
  }

  return oreQuantity;
}

const data =
  "1 GZJM, 2 CQFGM, 20 SNPQ, 7 RVQG, 3 FBTV, 27 SQLH, 10 HFGCF, 3 ZQCH => 3 SZCN\n" +
  "4 FCDL, 6 NVPW, 21 GZJM, 1 FBTV, 1 NLSNB, 7 HFGCF, 3 SNPQ => 1 LRPK\n" +
  "15 FVHTD, 2 HBGFL => 4 BCVLZ\n" +
  "4 GFGS => 4 RVQG\n" +
  "5 BCVLZ, 4 LBQV => 7 TWSRV\n" +
  "6 DWKTF, 4 VCKL => 4 KDJV\n" +
  "16 WZJB => 4 RBGJQ\n" +
  "8 RBGJQ, 5 FCDL, 2 LWBQ => 1 MWSX\n" +
  "100 ORE => 7 WBRL\n" +
  "7 PGZGQ => 5 FVHTD\n" +
  "1 JCDML, 2 TWSRV => 9 JSQSB\n" +
  "3 WZJB, 1 NXNR => 6 XFPVS\n" +
  "7 JPCPK => 8 JCDML\n" +
  "11 LWBQ, 8 XFPVS => 9 PSPFR\n" +
  "2 TWSRV => 8 NVPW\n" +
  "2 LBQV => 1 PMJFD\n" +
  "2 LCZBD => 3 FBTV\n" +
  "1 WBQC, 1 ZPNKQ => 8 JPCPK\n" +
  "44 HFGCF, 41 PSPFR, 26 LMSCR, 14 MLMDC, 6 BWTHK, 3 PRKPC, 13 LRPK, 50 MWSX, 8 SZCN => 1 FUEL\n" +
  "1 XFPVS => 4 BJRSZ\n" +
  "1 GWBDR, 1 MBQC => 4 HZPRB\n" +
  "2 BJRSZ, 9 KDJV, 1 XFPVS => 8 SNVL\n" +
  "7 PMJFD, 30 SNVL, 1 BJRSZ => 2 JMTG\n" +
  "8 SNVL, 1 RBGJQ => 9 FCDL\n" +
  "2 HZPRB => 6 NLSNB\n" +
  "2 GRDG => 9 VCKL\n" +
  "1 FVHTD => 9 WZJB\n" +
  "130 ORE => 2 GRDG\n" +
  "3 WZJB, 1 GFGS, 1 NXNR => 9 SNPQ\n" +
  "9 VCKL => 5 WBQC\n" +
  "1 WBRL, 11 FPMPB => 7 PGZGQ\n" +
  "118 ORE => 3 LMSCR\n" +
  "3 SQLH, 1 PMJFD, 4 XJBL => 7 MLMDC\n" +
  "1 LMSCR, 10 GRDG => 2 TBDH\n" +
  "6 DWKTF => 2 SQLH\n" +
  "2 BJRSZ, 1 PGZGQ, 3 NXNR => 7 MBQC\n" +
  "5 PRKPC => 7 NXNR\n" +
  "9 SQLH => 5 LCZBD\n" +
  "1 FCDL => 9 CQFGM\n" +
  "5 PGZGQ, 1 TBDH => 8 HBGFL\n" +
  "15 JSQSB => 5 HFGCF\n" +
  "2 PGZGQ, 1 VCKL => 4 ZPNKQ\n" +
  "3 FBTV, 3 JMTG => 5 QLHKT\n" +
  "1 ZGZST, 2 LCZBD => 7 GFGS\n" +
  "2 RVQG => 4 ZQCH\n" +
  "1 ZPNKQ => 5 LBQV\n" +
  "3 LWBQ => 8 XJBL\n" +
  "1 LBQV, 9 JCDML => 3 GWBDR\n" +
  "8 VCKL, 6 FVHTD => 9 DWKTF\n" +
  "3 JCDML => 3 ZGZST\n" +
  "160 ORE => 5 FPMPB\n" +
  "3 SQLH, 22 LBQV, 5 BCVLZ => 6 PRKPC\n" +
  "1 WZJB => 2 GZJM\n" +
  "10 ZGZST => 2 LWBQ\n" +
  "5 TBDH, 19 NXNR, 9 QLHKT, 2 KDJV, 1 SQLH, 1 GWBDR, 6 HFGCF => 4 BWTHK";

const reactionsList = data.split("\n").map(str => {
  str = str.split("=>").map(part => part.trim());
  const [lhs, rhs] = str;
  return {
    result: { chemical: rhs.split(" ")[1], quantity: +rhs.split(" ")[0] },
    components: lhs
      .split(",")
      .map(s => s.trim())
      .map(part => ({
        chemical: part.split(" ")[1],
        quantity: +part.split(" ")[0]
      }))
  };
});

let low = 0;
let high = Number.MAX_SAFE_INTEGER;
while (low < high) {
  const middle = Math.ceil((low + high) / 2);
  const oreUsed = getOrePerChemical(reactionsList, "FUEL", middle);
  if (TRILLION - oreUsed > 0) {
    low = middle + 1;
  } else {
    high = middle;
  }
}

console.log(high - 1);
