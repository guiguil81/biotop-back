import { GameType } from '../cron/gameProcess';

const getBasicSpecies = async () => {
  return await strapi.entityService.findMany('api::specie.specie', {
    fields: ['defaultQty'],
    where: {
      isPrimitive: true,
    },
  });
};

const getBasicGameHaveSpecies = async (game: GameType) => {
  return await strapi.entityService.findMany(
    'api::game-have-specie.game-have-specie',
    {
      fields: [],
      where: {
        $and: [
          {
            game: game.id,
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
      where: {
        $and: [
          {
            game: game.id,
          },
        ],
      },
      populate: {
        specie: {
          fields: ['reproduction', 'eat', 'product', 'dead'],
          populate: {
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
              },
            },
          },
        },
      },
    },
  );
};

export { getBasicSpecies, getBasicGameHaveSpecies, getGameHaveSpecies };
