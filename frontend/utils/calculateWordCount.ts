/**
 * Calculates the total number of words in the text content of a specified HTML element or an element selected by a string selector.
 * 
 * @param elementOrSelector - The HTML element or string selector of the element whose text content will be analyzed.
 * @returns The total number of words in the element's text content. Returns 0 if the element is not found or contains no text.
 */
export default function calculateWordCount(elementOrSelector: Element | string): number {
  const element = typeof elementOrSelector === 'string' 
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;

  if (!element || !element.textContent) {
      return 0;
  }

  const words = element.textContent.match(/\S+/g) || [];
  return words.length;
}

// Usage examples
// const wordCount1 = calculateWordCount(".quill"); // using a selector
// const textEditorElem = document.querySelector<HTMLDivElement>(".quill");
// const wordCount2 = textEditorElem ? calculateWordCount(textEditorElem) : 0; // using an Element
