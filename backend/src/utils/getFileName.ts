/**
 * @see https://chatgpt.com/share/67a8930b-f6a4-800a-bcfd-741afee2b04e
 */
const getFileName = (path: string) => path.slice(path.lastIndexOf('/') + 1)

export default getFileName