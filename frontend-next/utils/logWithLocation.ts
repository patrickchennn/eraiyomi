import chalk from "chalk";

export default function logWithLocation(...args: any[]) {
  const error = new Error();
  console.log("error=",error)

  const stackLines = error.stack!.split('\n');
  const callerInfo = stackLines[2].trim();
  console.log()
  console.log(chalk.blue(`[info]: ${callerInfo}`))
  console.log(...args)
  console.log()
}