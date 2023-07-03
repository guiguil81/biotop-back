const getCurrentGames = async currentRound => {
  return await strapi.entityService.findMany('api::game.game', {
    fields: ['id'],
    where: {
      $and: [
        {
          round: currentRound.id,
        },
      ],
    },
    populate: {
      element: {
        field: ['id'],
      },
      gameHaveSpecies: {
        fields: ['qty'],
        populate: {
          specie: {
            fields: ['id', 'reproduction', 'eat', 'product', 'dead'],
            populate: {
              element: {
                field: ['id'],
              },
            },
          },
        },
      },
    },
  });
};

const getCurrentGame = async (user, currentRound) => {
  return await strapi.entityService.findOne('api::game.game', {
    fields: ['id'],
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
