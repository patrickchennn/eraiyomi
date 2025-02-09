import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import {markedHighlight} from 'marked-highlight';
import chalk from 'chalk';

// Use marked-highlight as a plugin
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    // Options for marked-highlight
    highlight: (code,lang, info) => {
      // console.log("lang=",lang)
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const hlCode = hljs.highlight(code, { language })
      return hlCode.value;
    }
  }),
)

marked.use(
{
  // breaks: false,
  renderer:{
    list: (body: string, ordered: boolean, start: number | "") => {
      // console.log(chalk.yellow.bgBlack("@list()"))
      // console.log("body=",body)
      // console.log("ordered=",ordered)
      // console.log("start=",start)
      const listType = ordered ? "ol" : "ul";
      const listStyle = ordered ? "list-decimal" : "list-disc";

      return `<${listType} class="pl-10 ${listStyle}">${body}</${listType}>`;
      
    },
    codespan: (text) => {
      // console.log(chalk.yellow.bgBlack("@codespan()"))
      // console.log("text=",text)
      return `<code class="rounded-sm px-1 bg-gray-800 shadow-inner text-green-400">${text}</code>`
    },
  }
})

export const MarkdownRenderer = ({ markdownText }:{markdownText: string}) => {
 
  const rawMarkup = marked(markdownText);

  return <div dangerouslySetInnerHTML={{__html: rawMarkup}} />
};

export const markdownRenderStr = (markdownText: string) => {
  

    
  const rawMarkup = marked(markdownText);

  return rawMarkup
};
