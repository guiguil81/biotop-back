const getCurrentRound = async () => {
  return await strapi.entityService.findMany('api::round.round', {
    fields: [],
    filters: {
      isActive: true,
    },
  });
};

export default getCurrentRound;
