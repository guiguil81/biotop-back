import {
  GetNonPopulatableKeys,
  GetValues,
} from '@strapi/types/dist/types/core/attributes';

export type CurrentRoundType = GetValues<
  'api::round.round',
  GetNonPopulatableKeys<'api::round.round'>
>[];

const getCurrentGames = async (currentRound: CurrentRoundType) => {
  if (currentRound.length === 0) {
    return [];
  }
  return await strapi.entityService.findMany('api::game.game', {
    fields: [],
    where: {
      $and: [
        {
          round: currentRound[0].id,
        },
      ],
    },
    populate: {
      element: {
        fields: [],
      },
      gameHaveSpecies: {
        fields: ['qty'],
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
                        fields: [],
                      },
                    },
                  },
                  groupSpeciesRequiredBy: {
                    fields: [],
                    populate: {
                      species: {
                        fields: [],
                      },
                    },
                  },
                  groupSpeciesEat: {
                    fields: [],
                    populate: {
                      species: {
                        fields: [],
                      },
                    },
                  },
                  groupSpeciesEatenBy: {
                    fields: [],
                    populate: {
                      species: {
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
    },
  });
};

const getCurrentGame = async (user, currentRound) => {
  return await strapi.entityService.findMany('api::game.game', {
    fields: [],
    where: {
      $and: [
        {
          round: currentRound.id,
          user: user.id,
        },
      ],
    },
  });
};

export { getCurrentGames, getCurrentGame };
