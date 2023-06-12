export default {
  routes: [
    {
      method: 'GET',
      path: '/generateGame',
      handler: 'generator.generateGame',
      config: {
        policies: ['is-current-user'],
        middlewares: [],
      },
    },
  ],
};
