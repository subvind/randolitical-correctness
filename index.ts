import { setTimeout } from 'timers/promises';

// Types
type Party = 'Communist' | 'Democrat' | 'Nazism';

interface Player {
  name: string;
  party: Party;
  isPresident: boolean;
  randoliticalCorrectnessScore: number;
  isBanned: boolean;
}

interface GameState {
  players: Player[];
  currentRound: number;
  president: Player | null;
  mainEnvironmentVariable: string;
}

// Main game class
class RandoliticalGuessingGame {
  private gameState: GameState;

  constructor(players: Player[]) {
    this.gameState = {
      players,
      currentRound: 0,
      president: null,
      mainEnvironmentVariable: '',
    };
  }

  private getRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  private async delay(ms: number): Promise<void> {
    await setTimeout(ms);
  }

  private async playRound(): Promise<void> {
    this.gameState.currentRound++;
    console.log(`\n--- Round ${this.gameState.currentRound} ---`);
    
    const initNumber = this.getRandomNumber(9);
    console.log(`Initial number: ${initNumber}`);
    
    const winners: Player[] = [];

    for (const player of this.gameState.players) {
      if (player.isBanned) continue;

      const guess = this.getRandomNumber(9);
      console.log(`${player.name} guessed: ${guess}`);
      
      if (guess === initNumber) {
        winners.push(player);
        if (player.party === 'Democrat') {
          this.gameState.mainEnvironmentVariable = 'ban the freedom of speech';
        } else if (player.party === 'Nazism') {
          this.gameState.mainEnvironmentVariable = 'ban the jews';
        } else {
          this.gameState.mainEnvironmentVariable = 'ban the capitalism';
        }
        console.log(`${player.name} guessed correctly!`);
      }
    }

    if (winners.length === 1) {
      this.setPresident(winners[0]);
    } else if (winners.length > 1) {
      console.log("Multiple winners this round. It wont count.");
      // await this.delay(1000);
      // await this.playRound();
    } else {
      console.log("No winners this round, playing another round.");
      // await this.delay(1000);
      // await this.playRound();
    }
  }

  private setPresident(player: Player): void {
    this.gameState.players.forEach(p => p.isPresident = false);
    player.isPresident = true;
    this.gameState.president = player;
    console.log(`${player.name} is now the President!`);
    console.log(`Main environment variable set to: ${this.gameState.mainEnvironmentVariable}`);
  }

  private async calculateRandoliticalCorrectness(): Promise<void> {
    if (!this.gameState.president) return;

    console.log("\n--- Round X ---");
    const presidentGuess = this.getRandomNumber(9);
    // console.log(`President's guess: ${presidentGuess}`);

    let newPresident = false;
    for (const player of this.gameState.players) {
      if (player.isBanned || player.isPresident) continue;

      const playerGuess = this.getRandomNumber(9);
      // console.log(`${player.name}'s guess: ${playerGuess}`);
      
      // only increase scores for people of the opposit party
      if (player.party !== this.gameState.president.party) {
        const difference = Math.abs(playerGuess - presidentGuess);
        player.randoliticalCorrectnessScore += difference;
      }

      // console.log(`${player.name}'s randolitical correctness score: ${player.randoliticalCorrectnessScore}`);

      if (player.randoliticalCorrectnessScore > 100) {
        player.isBanned = true;
        console.log('\nXXXXXXXX');
        console.log(`${player.name} has been banned!`);
        console.log('XXXXXXXX\n');
      }

      if (newPresident) continue;
      if (playerGuess === presidentGuess) {
        console.log('\n========');
        console.log(`${player.name} guessed (${playerGuess}) correctly (${presidentGuess}) and becomes the new President!`);
        console.log('========\n');
        this.setPresident(player);
        newPresident = true;
      }
    }
  }

  public async playGame(): Promise<Player | null> {
    console.log("Game started!");
    this.logPlayerStatus();

    while (this.getActivePlayers().length > 1) {
      await this.playRound();
      await this.calculateRandoliticalCorrectness();
      this.logPlayerStatus();
      await this.delay(1500);
    }

    const winner = this.getActivePlayers()[0];
    return winner || null;
  }

  private getActivePlayers(): Player[] {
    return this.gameState.players.filter(player => !player.isBanned);
  }

  private logPlayerStatus(): void {
    console.log("\nCurrent Player Status:");
    console.table(this.gameState.players.map(player => ({
      Name: player.name,
      Party: player.party,
      President: player.isPresident ? 'Yes' : 'No',
      'RC Score': player.randoliticalCorrectnessScore,
      Banned: player.isBanned ? 'Yes' : 'No'
    })));
  }
}

// Usage example
const players: Player[] = [
  { name: 'Adolf Hitler', party: 'Nazism', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
  { name: 'Joseph Stalin', party: 'Communist', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
  { name: 'Mao Zedong', party: 'Communist', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
  { name: 'King Leopold II', party: 'Communist', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
  { name: 'Pol Pot', party: 'Communist', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
  { name: 'Hillary Clinton', party: 'Democrat', isPresident: false, randoliticalCorrectnessScore: 0, isBanned: false },
];

const game = new RandoliticalGuessingGame(players);
game.playGame().then(winner => {
  console.log(winner ? `The winner is ${winner.name}` : 'No winner');
});