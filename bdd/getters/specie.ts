const getBasicSpecies = async () => {
  return await strapi.entityService.findMany('api::specie.specie', {
    fields: ['id', 'defaultQty'],
    where: {
      isPrimitive: true,
    },
  });
};

export default getBasicSpecies;
