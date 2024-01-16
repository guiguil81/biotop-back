import {
  GetNonPopulatableKeys,
  GetValues,
} from '@strapi/types/dist/types/core/attributes';
import { Map, Record } from 'immutable';
import fixNumber from '../utils/fixNumber';
import productionCoef from './productionCoef';
import {
  getSpeciesIdForGroup,
  getGroupSpecies,
  getBasicSpeciesIdFromGameHaveSpecies,
} from '../utils/getSpeciesIdForGroup';
import { SpecieEvolution } from './interface';
import { getBasicGameHaveSpecies, getGameHaveSpecies } from '../getters/specie';

export type GameType = GetValues<
  'api::game.game',
  'element' | 'era' | GetNonPopulatableKeys<'api::game.game'>
>;

const gameProcess = async (game: GameType) => {
  let speciesObject: Map<string, Record<SpecieEvolution>> = Map();
  const gameElementId = game.element.id;

  const basicGameHaveSpeciesId = await getBasicGameHaveSpecies(game);
  const gameSpeciesId = getBasicSpeciesIdFromGameHaveSpecies(
    basicGameHaveSpeciesId,
  );

  const gameHaveSpecies = await getGameHaveSpecies(game, gameSpeciesId);

  // init all cycle process + cycle reproduction
  gameHaveSpecies.forEach(gameHaveSpecie => {
    const gameHaveSpecieId = gameHaveSpecie.id;
    const initSpecieQty = fixNumber(gameHaveSpecie.qty);

    const specie = gameHaveSpecie.specie;
    const specieId = specie.id;
    const specieElement = specie.element.id;

    const { reproduction, eat, product, dead } = gameHaveSpecie.specie;

    const eatFinal = fixNumber(initSpecieQty * eat);
    const nbReproduction = productionCoef(
      initSpecieQty,
      reproduction,
      fixNumber(gameElementId),
      fixNumber(specieElement),
    );

    speciesObject = speciesObject.mergeIn([specieId], {
      finalQty: 0,
      specieId,
      gameHaveSpecieId,
      initSpecieQty: fixNumber(initSpecieQty),
      reproduction: nbReproduction,
      eat: eatFinal,
      product: fixNumber(initSpecieQty * product),
      dead: fixNumber(initSpecieQty * dead),
      deadByRequire: 0,
    });

    // update final qty with reproduction
    speciesObject = speciesObject.mergeIn([specieId], {
      finalQty: fixNumber(fixNumber(initSpecieQty) + nbReproduction),
    });

    // add require logics
    const { groupSpeciesRequire, groupSpeciesRequiredBy } =
      gameHaveSpecie.specie.groupSpecie;
    const require = getSpeciesIdForGroup(groupSpeciesRequire);
    const requiredBy = getSpeciesIdForGroup(groupSpeciesRequiredBy);

    speciesObject = speciesObject.mergeIn([specieId], {
      require: require,
      requiredBy: requiredBy,
    });

    require.forEach(requireId => {
      speciesObject = speciesObject.updateIn(
        [requireId, 'nbRequiredBy'],
        0,
        (value: number) => value + eatFinal,
      );
    });

    // add eat logic
    const { groupSpeciesEat, groupSpeciesEatenBy } =
      gameHaveSpecie.specie.groupSpecie;
    const eatGroupSpecies = getSpeciesIdForGroup(groupSpeciesEat);
    const eatGroupSpeciesBy = getSpeciesIdForGroup(groupSpeciesEatenBy);
    const eatGroup = getGroupSpecies(groupSpeciesEat);
    const eatGroupBy = getGroupSpecies(groupSpeciesEatenBy);

    speciesObject = speciesObject.mergeIn([specieId], {
      eatGroupSpecies: eatGroupSpecies,
      eatGroupSpeciesBy: eatGroupSpeciesBy,
      eatGroup: eatGroup,
      eatGroupBy: eatGroupBy,
    });
  });

  // cycle A require
  speciesObject = speciesObject.withMutations(map => {
    map.forEach((specie, specieId) => {
      const finalQty = specie.get('finalQty');
      let nbRequiredBy = specie.get('nbRequiredBy');
      const requiredBy = specie.get('requiredBy');

      if (nbRequiredBy === undefined) nbRequiredBy = 0;
      const requireDifference = finalQty - nbRequiredBy;

      if (requireDifference < 0) {
        requiredBy.forEach(requiredById => {
          const eat = speciesObject.getIn([requiredById, 'eat']) as number;
          const proportion = eat / nbRequiredBy;
          const nbCanEat = fixNumber(proportion * finalQty);

          const deadByRequire = fixNumber(eat - nbCanEat);

          map.updateIn(
            [requiredById, 'deadByRequire'],
            0,
            (value: number) => value + deadByRequire,
          );
        });
        map.setIn([specieId, 'finalQty'], 0);
      } else {
        map.setIn([specieId, 'finalQty'], requireDifference);
      }
    });
  });

  // cycle update qty
  speciesObject = speciesObject.withMutations(map => {
    map.forEach((specie, specieId) => {
      const finalQty = specie.get('finalQty');
      let deadByRequire = specie.get('deadByRequire');

      if (deadByRequire === undefined) deadByRequire = 0;
      const deadDifference = finalQty - deadByRequire;

      map.setIn([specieId, 'finalQty'], deadDifference);
    });
  });

  // cycle A element
  speciesObject = speciesObject.withMutations(map => {
    // init willEatBy
    map.forEach((specie, specieId) => {
      const eatGroup = specie.get('eatGroup');
      const eat = specie.get('eat');

      eatGroup.map(groups => {
        let totalEat: number = 0;
        groups.forEach(specieOnGroup => {
          const finalQty = map.getIn([specieOnGroup, 'finalQty'], 0) as number;
          totalEat += finalQty;
        });

        groups.forEach(specieOnGroup => {
          const finalQty = map.getIn([specieOnGroup, 'finalQty'], 0) as number;
          let qtyEat: number;
          if (totalEat === 0) {
            qtyEat = fixNumber(eat / groups.length);
          } else {
            qtyEat = fixNumber((eat * finalQty) / totalEat);
          }

          map.updateIn(
            [specieOnGroup, 'willEatBy'],
            [],
            (value: { specieId: string; qtyEat: number }[]) =>
              value.concat({ specieId: specieId, qtyEat: qtyEat }),
          );
          map.updateIn(
            [specieOnGroup, 'nbEatGroupBy'],
            0,
            (value: number) => value + qtyEat,
          );
        });
      });
    });

    // add calculation and update qty
    map.forEach((specie, specieId) => {
      const willEatBy = specie.get('willEatBy');

      if (willEatBy !== undefined && willEatBy.length !== 0) {
        const finalQty = specie.get('finalQty');
        let nbEatGroupBy = specie.get('nbEatGroupBy');

        if (nbEatGroupBy === undefined) {
          nbEatGroupBy = 0;
        }

        const requireDifference = finalQty - nbEatGroupBy;

        if (requireDifference < 0) {
          willEatBy.forEach(eatBy => {
            const eat = eatBy.qtyEat;
            const proportion = fixNumber(eat / nbEatGroupBy);
            const canEat = fixNumber(proportion * finalQty);

            const deadByEat = fixNumber(eat - canEat);

            map.updateIn(
              [eatBy.specieId, 'deadByEat'],
              0,
              (value: number) => value + deadByEat,
            );
          });
          map.setIn([specieId, 'finalQty'], 0);
        } else {
          map.setIn([specieId, 'finalQty'], requireDifference);
        }
      }
    });
  });

  /*
  // cycle update qty
  speciesObject = speciesObject.withMutations(map => {
    map.forEach((specie, specieId) => {
      const finalQty = specie.get('finalQty');
      let deadByEat = specie.get('deadByEat');

      if (deadByEat === undefined) deadByEat = 0;
      const deadDifference = finalQty - deadByEat;

      map.setIn([specieId, 'finalQty'], deadDifference);
    });
  });

   */

  speciesObject.forEach((specieRecord, specieId) => {
    // console.log(`ID de l'espèce: ${specieId}`);
    console.log(`Données de l'espèce:`, specieRecord.toJS()); // Convertit le Record en objet JavaScript pour l'affichage
  });
};

export default gameProcess;
