import * as readline from 'readline';
import { ScenarioGenerator, TrainingScenario, PlayerAction } from '../training/scenarios';
import { Card } from '../core/types';

export class CLIInterface {
  private rl: readline.Interface;
  private scenarioGenerator: ScenarioGenerator;
  private score: number = 0;
  private totalScenarios: number = 0;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
    
    // Handle cleanup on exit
    process.on('SIGINT', () => {
      console.log('\n\nExiting...');
      this.rl.close();
      process.exit(0);
    });
    
    this.scenarioGenerator = new ScenarioGenerator();
  }

  async start(): Promise<void> {
    console.log('\n=== POKER TRAINER ===');
    console.log('Train your poker decision-making skills!\n');
    
    while (true) {
      const choice = await this.showMainMenu();
      
      switch (choice) {
        case '1':
          await this.runTrainingSession('preflop');
          break;
        case '2':
          await this.runTrainingSession('postflop');
          break;
        case '3':
          this.showStatistics();
          break;
        case '4':
          console.log('\nThanks for training! Goodbye!');
          this.rl.close();
          return;
        default:
          console.log('\nInvalid choice. Please try again.');
      }
    }
  }

  private async showMainMenu(): Promise<string> {
    console.log('\nMAIN MENU:');
    console.log('1. Practice Preflop Decisions');
    console.log('2. Practice Postflop Decisions');
    console.log('3. View Statistics');
    console.log('4. Exit');
    
    let choice: string;
    do {
      choice = await this.question('\nEnter your choice (1-4): ');
      if (!['1', '2', '3', '4'].includes(choice.trim())) {
        console.log('Invalid choice. Please enter 1, 2, 3, or 4.');
      }
    } while (!['1', '2', '3', '4'].includes(choice.trim()));
    
    return choice.trim();
  }

  private async runTrainingSession(type: 'preflop' | 'postflop'): Promise<void> {
    try {
      console.log(`\n=== ${type.toUpperCase()} TRAINING ===`);
      
      const scenario = type === 'preflop' 
        ? this.scenarioGenerator.generatePreflopScenario()
        : this.scenarioGenerator.generatePostflopScenario();
      
      this.displayScenario(scenario);
      
      const userAction = await this.getUserAction();
      const isCorrect = this.evaluateAction(userAction, scenario.correctAction);
      
      this.totalScenarios++;
      if (isCorrect) {
        this.score++;
        console.log('\n✅ CORRECT! ' + scenario.explanation);
      } else {
        console.log('\n❌ INCORRECT. ' + scenario.explanation);
        console.log(`The correct action was: ${this.formatAction(scenario.correctAction)}`);
      }
      
      await this.question('\nPress Enter to continue...');
    } catch (error) {
      console.error('❌ Error during training session:', error instanceof Error ? error.message : error);
      await this.question('\nPress Enter to continue...');
    }
  }

  private displayScenario(scenario: TrainingScenario): void {
    console.log(`\n--- ${scenario.name} ---`);
    console.log(`Difficulty: ${scenario.difficulty}`);
    console.log(`\n${scenario.description}`);
    
    const hero = scenario.gameState.players.find(p => p.id === 'hero');
    if (hero) {
      console.log(`\nYour cards: ${this.formatCards(hero.cards)}`);
      console.log(`Your chips: ${hero.chips}`);
    }
    
    if (scenario.gameState.communityCards.length > 0) {
      console.log(`Community cards: ${this.formatCards(scenario.gameState.communityCards)}`);
    }
    
    console.log(`\nPot: ${scenario.gameState.pot}`);
    console.log(`Current bet: ${scenario.gameState.currentBet}`);
    
    const activePlayers = scenario.gameState.players.filter(p => !p.folded && p.id !== 'hero');
    console.log(`\nOpponents:`);
    activePlayers.forEach(player => {
      console.log(`  ${player.name}: ${player.chips} chips (bet: ${player.currentBet})`);
    });
  }

  private formatCards(cards: Card[]): string {
    return cards.map(card => {
      const suitSymbol = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
      }[card.suit];
      return `${card.rank}${suitSymbol}`;
    }).join(' ');
  }

  private async getUserAction(): Promise<PlayerAction> {
    console.log('\n\nWhat is your action?');
    console.log('1. Fold');
    console.log('2. Check');
    console.log('3. Call');
    console.log('4. Raise');
    console.log('5. All-in');
    
    let choice: string;
    do {
      choice = await this.question('\nEnter your choice (1-5): ');
      choice = choice.trim();
      if (!['1', '2', '3', '4', '5'].includes(choice)) {
        console.log('Invalid choice. Please enter 1, 2, 3, 4, or 5.');
      }
    } while (!['1', '2', '3', '4', '5'].includes(choice));
    
    switch (choice) {
      case '1':
        return { type: 'fold' };
      case '2':
        return { type: 'check' };
      case '3':
        return { type: 'call' };
      case '4':
        let amount: number;
        do {
          const amountStr = await this.question('Raise amount: ');
          amount = parseInt(amountStr.trim());
          if (isNaN(amount) || amount <= 0) {
            console.log('Please enter a valid positive number.');
          }
        } while (isNaN(amount) || amount <= 0);
        return { type: 'raise', amount };
      case '5':
        return { type: 'all-in' };
      default:
        return { type: 'fold' };
    }
  }

  private evaluateAction(userAction: PlayerAction, correctAction: PlayerAction): boolean {
    if (userAction.type !== correctAction.type) {
      return false;
    }
    
    if (userAction.type === 'raise' && correctAction.type === 'raise') {
      const userAmount = userAction.amount || 0;
      const correctAmount = correctAction.amount || 0;
      return Math.abs(userAmount - correctAmount) / correctAmount < 0.3;
    }
    
    return true;
  }

  private formatAction(action: PlayerAction): string {
    if (action.type === 'raise' && action.amount) {
      return `Raise to ${action.amount}`;
    }
    return action.type.charAt(0).toUpperCase() + action.type.slice(1);
  }

  private showStatistics(): void {
    console.log('\n=== YOUR STATISTICS ===');
    console.log(`Total scenarios: ${this.totalScenarios}`);
    console.log(`Correct decisions: ${this.score}`);
    
    if (this.totalScenarios > 0) {
      const percentage = (this.score / this.totalScenarios * 100).toFixed(1);
      console.log(`Success rate: ${percentage}%`);
    }
  }

  private question(prompt: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(prompt, (answer) => {
        resolve(answer || '');
      });
    });
  }
}