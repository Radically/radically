import genBaseForwardReverse from "./genBaseForwardReverse";
import genStrokeCount from "./genStrokeCount";
import genReadings from "./genReadings";

const main = async () => {
  console.log("ETL Start");
  await genBaseForwardReverse();
  await genStrokeCount();
  await genReadings();
};

if (require.main === module) {
  main();
}
