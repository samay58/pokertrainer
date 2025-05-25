import { CLIInterface } from './ui/cli';

async function main() {
  try {
    const cli = new CLIInterface();
    await cli.start();
  } catch (error) {
    console.error('\n❌ Application error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
});