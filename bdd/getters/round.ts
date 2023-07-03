const getCurrentRound = async () => {
  return await strapi.entityService.findMany('api::round.round', {
    fields: ['id'],
    where: {
      isActive: true,
    },
  });
};

export default getCurrentRound;
