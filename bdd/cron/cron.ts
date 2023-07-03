// const limit = 9 007 199 254 740 991
import getCurrentRound from '../getters/round';
import { returnError } from '../../config/error';
import { getCurrentGames } from '../getters/game';
import gameProcess from './gameProcess';

export default module.exports = {
  '* * * * * *': async () => {
    return null;

    const currentRound = await getCurrentRound();

    if (currentRound === null) {
      return null;
    }

    const currentGames = await getCurrentGames(currentRound);

    currentGames.forEach(game => {
      gameProcess(game);
    });
  },
};
