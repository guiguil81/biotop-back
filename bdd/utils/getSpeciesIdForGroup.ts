const getSpeciesIdForGroup = (groups): number[] => {
  const speciesId = [];

  groups.forEach(group => {
    group.species.forEach(specie => {
      speciesId.push(specie.id);
    });
  });

  return speciesId;
};

const getGroupSpecies = (groups): number[] => {
  const groupsId = [];

  groups.forEach(group => {
    const groupId = [];
    group.species.forEach(specie => {
      groupId.push(specie.id);
    });

    groupsId.push(groupId);
  });

  return groupsId;
};

export { getSpeciesIdForGroup, getGroupSpecies };
