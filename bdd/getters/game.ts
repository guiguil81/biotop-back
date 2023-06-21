const getCurrentGame = async (user, currentRound) => {
  return await strapi.db.query('api::game.game').findOne({
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

export default getCurrentGame;
