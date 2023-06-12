const returnError = (ctx) => {
  return ctx.body = {
    success: false,
  };
}

const returnDebugError = (ctx, err) => {
  return ctx.body = {
    success: false,
    err
  };
}

export {returnError, returnDebugError}
