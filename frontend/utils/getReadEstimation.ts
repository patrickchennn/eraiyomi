const getReadEstimation = (wordCount: number) => wordCount < 200 ? "<1 min" : `${customRound(wordCount/200)} min`

const customRound = (number: number) => {
  const decimalPart = number - Math.floor(number);
  if (decimalPart >= 0.5) {
    return Math.ceil(number);
  } else {
    return Math.floor(number);
  }
}

export default getReadEstimation