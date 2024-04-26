import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import {markedHighlight} from 'marked-highlight';

// Use marked-highlight as a plugin
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  // Options for marked-highlight
  highlight: (code,lang, info) => {
    // console.log("lang=",lang)
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    const hlCode = hljs.highlight(code, { language })
    return hlCode.value;
  }
}));

export const MarkdownRenderer = ({ markdownText }:{markdownText: string}) => {
 
  const rawMarkup = marked(markdownText);

  return <div dangerouslySetInnerHTML={{__html: rawMarkup}} />
};

export const markdownRenderStr = (markdownText: string) => {
  

    
  const rawMarkup = marked(markdownText);

  return rawMarkup
};
