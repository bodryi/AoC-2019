const numsArray = [
  80740,
  103617,
  86598,
  135938,
  98650,
  84982,
  79253,
  122436,
  119679,
  89758,
  131375,
  112500,
  111603,
  112563,
  111174,
  114961,
  131423,
  144920,
  56619,
  94542,
  94533,
  116453,
  78286,
  70985,
  91005,
  116346,
  137141,
  90815,
  68806,
  61549,
  116078,
  53067,
  116991,
  58210,
  54878,
  98184,
  108532,
  130796,
  144893,
  137845,
  57481,
  133204,
  125789,
  99573,
  121718,
  73905,
  105746,
  134401,
  136337,
  74788,
  147758,
  128636,
  97457,
  84983,
  57520,
  125839,
  68230,
  106761,
  147436,
  95604,
  142427,
  82718,
  81692,
  138713,
  53145,
  90348,
  69312,
  139908,
  139836,
  91889,
  126399,
  130204,
  103643,
  70653,
  81236,
  99555,
  64461,
  128172,
  122914,
  71321,
  141502,
  124121,
  67214,
  64612,
  78519,
  69582,
  124489,
  95904,
  124274,
  66556,
  140500,
  112775,
  114855,
  57332,
  50072,
  79830,
  126844,
  67276,
  137841,
  108654
];

const result = numsArray.reduce(
  (acc, curr) => acc + Math.floor(curr / 3) - 2,
  0
);

console.log(result);
