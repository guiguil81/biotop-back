export default {
  routes: [
    {
      method: 'GET',
      path: '/myRank',
      handler: 'rank.myRank',
      config: {
        policies: ['is-current-user'],
        middlewares: [],
      },
    },
  ],
};
