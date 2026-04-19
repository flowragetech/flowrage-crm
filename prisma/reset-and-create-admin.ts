export {};

async function main() {
  console.error('Manual admin reset has been removed. Use /setup instead.');
  process.exit(1);
}

main().catch(() => {
  process.exit(1);
});
