// Types
type Party = 'Republican' | 'Democrat';

interface Player {
  name: string;
  party: Party;
  isPresident: boolean;
  politicalCorrectnessScore: number;
  isBanned: boolean;
}

interface GameState {
  players: Player[];
  currentRound: number;
  president: Player | null;
  mainEnvironmentVariable: string;
}

// Main game class
class PoliticalGuessingGame {
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

  private playRound(): void {
    this.gameState.currentRound++;
    console.log(`\n--- Round ${this.gameState.currentRound} ---`);
    
    const initNumber = this.getRandomNumber(9);
    console.log(`Initial number: ${initNumber}`);
    
    const winners: Player[] = [];

    this.gameState.players.forEach(player => {
      if (player.isBanned) return;

      const guess = this.getRandomNumber(9);
      console.log(`${player.name} guessed: ${guess}`);
      
      if (guess === initNumber) {
        winners.push(player);
        this.gameState.mainEnvironmentVariable = player.party === 'Republican' ? 'ban the left' : 'ban the right';
        console.log(`${player.name} guessed correctly!`);
      }
    });

    if (winners.length === 1) {
      this.setPresident(winners[0]);
    } else if (winners.length > 1) {
      console.log("Multiple winners, playing another round.");
      this.playRound();
    } else {
      console.log("No winners, playing another round.");
      this.playRound();
    }
  }

  private setPresident(player: Player): void {
    this.gameState.players.forEach(p => p.isPresident = false);
    player.isPresident = true;
    this.gameState.president = player;
    console.log(`${player.name} is now the President!`);
    console.log(`Main environment variable set to: ${this.gameState.mainEnvironmentVariable}`);
  }

  private calculatePoliticalCorrectness(): void {
    if (!this.gameState.president) return;

    console.log("\n--- Political Correctness Round ---");
    const presidentGuess = this.getRandomNumber(9);
    console.log(`President's guess: ${presidentGuess}`);

    this.gameState.players.forEach(player => {
      if (player.isBanned || player.isPresident) return;

      const playerGuess = this.getRandomNumber(9);
      console.log(`${player.name}'s guess: ${playerGuess}`);
      
      const difference = Math.abs(playerGuess - presidentGuess);
      player.politicalCorrectnessScore += difference;

      console.log(`${player.name}'s political correctness score: ${player.politicalCorrectnessScore}`);

      if (player.politicalCorrectnessScore > 100) {
        player.isBanned = true;
        console.log(`${player.name} has been banned!`);
      }

      if (playerGuess === presidentGuess) {
        console.log(`${player.name} guessed correctly and becomes the new President!`);
        this.setPresident(player);
      }
    });
  }

  public playGame(): Player | null {
    console.log("Game started!");
    this.logPlayerStatus();

    while (this.getActivePlayers().length > 1) {
      this.playRound();
      this.calculatePoliticalCorrectness();
      this.logPlayerStatus();
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
      'PC Score': player.politicalCorrectnessScore,
      Banned: player.isBanned ? 'Yes' : 'No'
    })));
  }
}

// Usage example
const players: Player[] = [
  { name: 'Alice', party: 'Democrat', isPresident: false, politicalCorrectnessScore: 0, isBanned: false },
  { name: 'Bob', party: 'Republican', isPresident: false, politicalCorrectnessScore: 0, isBanned: false },
  { name: 'Charlie', party: 'Democrat', isPresident: false, politicalCorrectnessScore: 0, isBanned: false },
  { name: 'David', party: 'Republican', isPresident: false, politicalCorrectnessScore: 0, isBanned: false },
];

const game = new PoliticalGuessingGame(players);
const winner = game.playGame();

console.log(winner ? `The winner is ${winner.name}` : 'No winner');