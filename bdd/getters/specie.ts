import { GameType } from '../cron/gameProcess';

const getBasicSpecies = async () => {
  return await strapi.entityService.findMany('api::specie.specie', {
    fields: ['defaultQty'],
    filters: {
      isPrimitive: true,
    },
  });
};

const getBasicGameHaveSpecies = async (game: GameType) => {
  return await strapi.entityService.findMany(
    'api::game-have-specie.game-have-specie',
    {
      fields: [],
      filters: {
        $and: [
          {
            game: {
              id: game.id,
            },
          },
        ],
      },
      populate: {
        specie: {
          fields: [],
        },
      },
    },
  );
};
const getGameHaveSpecies = async (game: GameType, gameSpeciesId: number[]) => {
  const groupSpecies = {
    fields: [],
    populate: {
      species: {
        filters: {
          $and: [
            {
              id: {
                $in: gameSpeciesId,
              },
            },
            {
              era: {
                level: {
                  $lte: game.era.level,
                },
              },
            },
          ],
        },
        fields: [],
      },
    },
  };

  return await strapi.entityService.findMany(
    'api::game-have-specie.game-have-specie',
    {
      fields: ['qty'],
      filters: {
        game: {
          id: game.id,
        },
      },
      populate: {
        specie: {
          fields: ['reproduction', 'eat', 'product', 'dead'],
          populate: {
            era: {
              fields: ['speciesFoundScore', 'specieMaxScore'],
            },
            element: {
              fields: [],
            },
            groupSpecie: {
              fields: [],
              populate: {
                groupSpeciesRequire: groupSpecies,
                groupSpeciesRequiredBy: groupSpecies,
                groupSpeciesEat: groupSpecies,
                groupSpeciesEatenBy: groupSpecies,
                groupSpeciesUse: groupSpecies,
                groupSpeciesUsedBy: groupSpecies,
                groupSpeciesProduce: groupSpecies,
                groupSpeciesProducedBy: groupSpecies,
                groupSpeciesProduceByDead: groupSpecies,
                groupSpeciesProducedByDeadBy: groupSpecies,
              },
            },
          },
        },
      },
    },
  );
};

export { getBasicSpecies, getBasicGameHaveSpecies, getGameHaveSpecies };
