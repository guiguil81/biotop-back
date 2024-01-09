import {
  GetNonPopulatableKeys,
  GetValues,
} from '@strapi/types/dist/types/core/attributes';
import { GameType } from '../cron/gameProcess';

const getBasicSpecies = async () => {
  return await strapi.entityService.findMany('api::specie.specie', {
    fields: ['defaultQty'],
    where: {
      isPrimitive: true,
    },
  });
};

const getGameHaveSpecies = async (game: GameType) => {
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
                groupSpeciesRequire: {
                  fields: [],
                  populate: {
                    species: {
                      filters: {
                        era: {
                          level: {
                            $lte: game.era.level,
                          },
                        },
                      },
                      fields: [],
                    },
                  },
                },
                groupSpeciesRequiredBy: {
                  fields: [],
                  populate: {
                    species: {
                      filters: {
                        era: {
                          level: {
                            $lte: game.era.level,
                          },
                        },
                      },
                      fields: [],
                    },
                  },
                },
                groupSpeciesEat: {
                  fields: [],
                  populate: {
                    species: {
                      filters: {
                        era: {
                          level: {
                            $lte: game.era.level,
                          },
                        },
                      },
                      fields: [],
                    },
                  },
                },
                groupSpeciesEatenBy: {
                  fields: [],
                  populate: {
                    species: {
                      filters: {
                        era: {
                          level: {
                            $lte: game.era.level,
                          },
                        },
                      },
                      fields: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );
};

export { getBasicSpecies, getGameHaveSpecies };
