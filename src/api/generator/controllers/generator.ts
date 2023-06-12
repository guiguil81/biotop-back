/**
 * A set of functions called "actions" for `generator`
 */
import getCurrentRound from "../../../../bdd/getters/round";
import {returnDebugError, returnError} from "../../../../config/error";
import createGame from "../../../../bdd/create/game";
import getCurrentGame from "../../../../bdd/getters/game";
import getBasicSpecies from "../../../../bdd/getters/specie";
import createGameHaveSpecie from "../../../../bdd/create/gameHaveSpecie";

export default {
  generateGame: async (ctx, next) => {
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

      const userHaveGame = await getCurrentGame(currentUser, currentRound);

      if (userHaveGame !== null) {
        returnError(ctx)
        return null
      }

      const newGame = await createGame(currentUser, currentRound)
      console.log('newGame', newGame)

      if (newGame === null) {
        returnError(ctx)
        return null
      }

      const basicSpecies = await getBasicSpecies();

      basicSpecies.forEach((basicSpecie) => {
        createGameHaveSpecie(newGame, basicSpecie)
      })

      ctx.body = {
        success: true,
        data: {
          game: newGame
        }
      };
    } catch (err) {
      returnDebugError(ctx, err)
    }
  }
};
