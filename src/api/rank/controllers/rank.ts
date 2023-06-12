/**
 * A set of functions called "actions" for `generator`
 */
import getCurrentRound from "../../../../bdd/getters/round";
import {returnDebugError, returnError} from "../../../../config/error";
import createGame from "../../../../bdd/create/game";
import getCurrentGame from "../../../../bdd/getters/game";
import getBasicSpecies from "../../../../bdd/getters/specie";
import createGameHaveSpecie from "../../../../bdd/create/gameHaveSpecie";
import getMyRank from "../../../../bdd/getters/rank";

export default {
  myRank: async (ctx, next) => {
    try {
      const currentRound = await getCurrentRound()

      if (currentRound === null) {
        returnError(ctx)
        return null
      }

      const currentUser = ctx.state.user;

      if (currentUser === null) {
        returnError(ctx)
        return null
      }

      const myRank = await getMyRank(currentRound, currentUser)

      ctx.body = {
        success: true,
        data: {
          rank: myRank
        }
      };
    } catch (err) {
      returnDebugError(ctx, err)
    }
  }
};
