const updateGameHaveSpecies = async (
  gameHaveSpecieId: string,
  finalQty: number,
) => {
  return await strapi.entityService.update(
    'api::game-have-specie.game-have-specie',
    gameHaveSpecieId,
    {
      data: {
        qty: finalQty,
      },
    },
  );
};

export { updateGameHaveSpecies };
