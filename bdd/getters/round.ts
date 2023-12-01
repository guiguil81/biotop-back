const getCurrentRound = async () => {
  return await strapi.entityService.findMany('api::round.round', {
    fields: [],
    where: {
      isActive: true,
    },
  });
};

export default getCurrentRound;
