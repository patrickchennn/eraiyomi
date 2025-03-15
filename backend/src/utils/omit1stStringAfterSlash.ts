/**
 * @see https://chatgpt.com/share/67a5ddd3-6100-800a-87d2-064a1a13f5ac
 * 
 * @param src String source
 */
const omit1stStringAfterSlash = (src: string) => {
  const index = src.indexOf('/');
  const result = src.slice(index + 1);
  return result
}

export default omit1stStringAfterSlash