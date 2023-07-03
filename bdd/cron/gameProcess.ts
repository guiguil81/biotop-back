import fixNumber from '../utils/fixNumber';
import productionCoef from './productionCoef';

const gameProcess = game => {
  const speciesEvolution = {};
  const gameElement = game.element.id;

  game.gameHaveSpecies.forEach(gameHaveSpecie => {
    const gameHaveSpecieId = gameHaveSpecie.id;
    const initQty = gameHaveSpecie.qty;
    const specie = gameHaveSpecie.specie;
    const specieId = specie.id;
    const specieElement = specie.element.id;
    const { reproduction, eat, product, dead } = gameHaveSpecie.specie;

    speciesEvolution[specieId] = {
      specieId,
      gameHaveSpecieId,
      initQty: fixNumber(initQty),
      reproduction: productionCoef(
        initQty,
        reproduction,
        gameElement,
        specieElement,
      ),
      eat: fixNumber(initQty * eat),
      product: fixNumber(initQty * product),
      dead: fixNumber(initQty * dead),
    };
  });

  console.log('speciesEvolution', speciesEvolution);
};

export default gameProcess;
