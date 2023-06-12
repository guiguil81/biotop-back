const getMyRank = async (round, user) => {
  const allCurrentGames = await strapi.db.query('api::game.game').findMany({
    where: {
      round: round.id,
    },
    populate: ['user'],
    orderBy: { score: 'desc'}
  })

  return allCurrentGames.findIndex(game => {
    return game.user.id === user.id
  }) + 1
}

export default getMyRank
