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
    fields: ['ev'],
    filters: {
      $and: [
        {
          round: {
            id: currentRound[0].id,
          },
        },
      ],
    },
    populate: {
      element: {
        fields: [],
      },
      era: {
        fields: ['level', 'evByCycle', 'evMax'],
      },
    },
  });
};

const getCurrentGame = async (user, currentRound) => {
  console.log('currentRound[0].id', currentRound[0].id, user.id);
  return await strapi.entityService.findMany('api::game.game', {
    fields: [],
    filters: {
      $and: [
        {
          round: currentRound[0].id,
        },
        {
          user: user.id,
        },
      ],
    },
  });
};

export { getCurrentGames, getCurrentGame };
