const getBasicSpecies = async () => {
  return await strapi.db.query('api::specie.specie').findMany({
    where: {
      isPrimitive: true
    },
  })
}

export default getBasicSpecies
