import genBaseForwardReverse from './genBaseForwardReverse';

const main = async () => {
  console.log("ETL Start");
  await genBaseForwardReverse();
}

if (require.main === module) {
  main();
}