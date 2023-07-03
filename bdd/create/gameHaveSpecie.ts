const createGameHaveSpecie = async (game, specie) => {
  return await strapi.entityService.create(
    'api::game-have-specie.game-have-specie',
    {
      data: {
        game: game.id,
        specie: specie.id,
        qty: specie.defaultQty,
      },
    },
  );
};

export default createGameHaveSpecie;
