// const limit = 9 007 199 254 740 991
import getCurrentRound from '../getters/round';
import { getCurrentGames } from '../getters/game';
import gameProcess from './gameProcess';

export default module.exports = {
  '* * * * * *': async () => {
    return null;
    console.time('ExecutionCron');
    const currentRound = await getCurrentRound();

    if (currentRound.length === 0) return null;

    const currentGames = await getCurrentGames(currentRound);

    currentGames.forEach(game => {
      gameProcess(game);
    });

    console.timeEnd('ExecutionCron');
  },
};
