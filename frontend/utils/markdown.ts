function replaceMarkdownImageSyntax(mdText: string, srcImg: string, dstImg: string) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  return mdText.replace(imageRegex, (match, alt, url) => {
    if (url === srcImg) {
      return `![${alt}](${dstImg})`;
    }
    return match; // Leave unchanged if not the targeted src
  });
}

function extractMarkdownImagesSyntax(rawText: string) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [];
  
  let match;
  while ((match = imageRegex.exec(rawText)) !== null) {
    const alt = match[1];
    const url = match[2];
    const filename = decodeURIComponent(url.split('/').pop().split('?')[0]); // Extract filename

    matches.push({ alt, url, filename });
  }

  return matches;
}

export {replaceMarkdownImageSyntax,extractMarkdownImagesSyntax }