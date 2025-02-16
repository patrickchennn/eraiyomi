import chalk from "chalk"

const httpResLog = {
  inf: (method: any, url: any, status: string) => {
    console.info(chalk.blueBright.bgBlack(`[INF] ${method} ${url} ${status}`) )
  },
  ok: (method: any, url: any, status: string) => {
    console.info(chalk.green.bgBlack(`[OK] ${method} ${url} ${status}`) )
  },
  err: (method: any, url: any, status: string) => {
    console.info(chalk.red.bgBlack(`[ERR] ${method} ${url} ${status}`) )
  }
}

export default httpResLog