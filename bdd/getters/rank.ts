const getRanksAndMyRank = async (round, user) => {
  const allCurrentGames = await strapi.db.query('api::game.game').findMany({
    where: {
      round: round.id,
    },
    populate: ['user'],
    orderBy: { score: 'desc' },
  });

  const ranks = [];
  allCurrentGames.forEach(game => {
    ranks.push(game);
  });
  const myRank =
    allCurrentGames.findIndex(game => {
      return game.user.id === user.id;
    }) + 1;

  return {
    ranks,
    myRank,
  };
};

export default getRanksAndMyRank;
