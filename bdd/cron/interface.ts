interface SpecieEvolution {
  finalQty: number;
  specieId: string;
  gameHaveSpecieId: string;
  initSpecieQty: number;
  reproduction: number;
  eat: number;
  product: number;
  dead: number;
  require: number[];
  requiredBy: number[];
  nbRequiredBy: number;
  deadByRequire: number;
  eatGroupSpecies: number[];
  eatGroupSpeciesBy: number[];
  eatGroup: number[][];
  eatGroupBy: number[][];
  nbEatGroupBy: number;
  willEatBy: { specieId: string; qtyEat: number }[];
  deadByEat: number;
}

export { SpecieEvolution };
