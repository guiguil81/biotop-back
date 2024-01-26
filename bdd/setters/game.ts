import { ID } from '@strapi/database/dist/types';

const setScoreAndResourcesGames = async (
  gameId: ID,
  data: { score: number; ev: number },
) => {
  return await strapi.entityService.update('api::game.game', gameId, {
    data: data,
  });
};

export { setScoreAndResourcesGames };
