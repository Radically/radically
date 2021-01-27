import genBaseForwardReverse from "./genBaseForwardReverse";
import genStrokeCount from "./genStrokeCount";

const main = async () => {
  console.log("ETL Start");
  await genBaseForwardReverse();
  await genStrokeCount();
};

if (require.main === module) {
  main();
}
