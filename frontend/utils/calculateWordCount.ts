/**
 * Calculates the total number of words in a given string.
 * 
 * @param text - The input string whose words will be counted.
 * @returns The total number of words in the string. Returns 0 if the input is empty or contains no words.
 */
export default function calculateWordCount(text: string): number {
  if (!text.trim()) {
      return 0;
  }

  const words = text.match(/\S+/g) || [];
  return words.length;
}

// Usage example
// const wordCount = calculateWordCount("This is a sample text.");

// This version removes the DOM interaction and works purely with a string input. 