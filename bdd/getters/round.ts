const getCurrentRound = async () => {
  return await strapi.db.query('api::round.round').findOne({
    where: {
      isActive: true,
    },
  });
};

export default getCurrentRound;
