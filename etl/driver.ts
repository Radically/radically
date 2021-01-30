import genBaseForwardReverse from "./genBaseForwardReverse";
import genStrokeCount from "./genStrokeCount";
import genReadings from "./genReadings";
import genVariants from "./genVariants";

// https://stackoverflow.com/questions/23003252/window-performance-now-equivalent-in-nodejs
function clock(start: any) {
  if (!start) return process.hrtime();
  var end = process.hrtime(start);
  return Math.round(end[0] * 1000 + end[1] / 1000000);
}

const main = async () => {
  const startTime = clock(null);
  console.log("ETL Start");
  await genBaseForwardReverse();
  await genStrokeCount();
  await genReadings();
  await genVariants();
  // @ts-ignore
  console.log(`ETL End, ${clock(startTime) / 1000} s elapsed`);
};

if (require.main === module) {
  main();
}
