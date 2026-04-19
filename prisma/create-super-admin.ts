export {};

async function main() {
  console.error(
    'Manual super admin creation has been removed. Use /setup instead.'
  );
  process.exit(1);
}

main().catch(async () => {
  process.exit(1);
});
