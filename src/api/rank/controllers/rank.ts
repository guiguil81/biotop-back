/**
 * A set of functions called "actions" for `generator`
 */
import getCurrentRound from '../../../../bdd/getters/round';
import { returnDebugError, returnError } from '../../../../config/error';
import getRanksAndMyRank from '../../../../bdd/getters/rank';

export default {
  myRank: async (ctx, next) => {
    try {
      const currentRound = await getCurrentRound();

      if (currentRound === null) {
        returnError(ctx);
        return null;
      }

      const currentUser = ctx.state.user;

      if (currentUser === null) {
        returnError(ctx);
        return null;
      }

      console.log('la ?');
      const { myRank, ranks } = await getRanksAndMyRank(
        currentRound,
        currentUser,
      );

      ctx.body = {
        success: true,
        data: {
          myRank,
          ranks,
        },
      };
    } catch (err) {
      returnDebugError(ctx, err);
    }
  },
};
