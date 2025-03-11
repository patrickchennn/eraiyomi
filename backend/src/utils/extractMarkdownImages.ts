export default function extractMarkdownImages(rawText: string) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const result: {[filename: string]: {alt:string, url: string}} = {};
  
  let match;
  while ((match = imageRegex.exec(rawText)) !== null) {
    const alt = match[1];
    const url = match[2];
    // console.log("url=",url)
    
    const filename = decodeURIComponent(url.split('/').pop()!.split('?')[0]); // Extract filename

    result[filename] = { alt, url };
  }

  return result;
}
