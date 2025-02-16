const articleTitleToUrlSafe = (title: string) => {
  return title
    .toLocaleLowerCase()
    .replace(/[^A-Za-z0-9]+/g, '-')  // Replace non-alphanumeric characters with a single hyphen
    .replace(/^-+|-+$/g, '');        // Remove leading & trailing hyphens
}

export default articleTitleToUrlSafe

// https://chatgpt.com/share/67a36c76-d6f0-800a-b848-e1796295cbef