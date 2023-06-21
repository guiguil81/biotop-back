export default policyContext => {
  const isAuthenticated = !!policyContext.state.user;

  return isAuthenticated;
};
