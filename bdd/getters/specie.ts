const getBasicSpecies = async () => {
  return await strapi.entityService.findMany('api::specie.specie', {
    fields: ['defaultQty'],
    where: {
      isPrimitive: true,
    },
  });
};

export default getBasicSpecies;
