/**
 * @desc convert yyyy-mm-dd format into dd, month year. For example, 1021-12-03 -> 3 December 1021
 * @param date The format is expected to be yyyy-mm-dd
 * yyyy-mm-dd
 * 0123456789 (the indexes, this is just a helper)
 */
const months_en = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const months_id = [
  'Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
/**
 * convert date with format yyyy-mm-dd(2020-12-1 or 2020/12/1) to dd month yyyy(1 December 2020)
 */
const convertDate = (date: string) => {
  // console.log("date=",date)

  const monthNumber = date[5] + date[6] // mm
  const dayNumber = date[8] + date[9] // dd
  const yearNumber = date.substring(0,4) // yyyy
  
  let res = ""

  if(date[8]==='0'){
    res += date[9]+" "
  }else{
    res += dayNumber+" "
  }

  if(date[5]==='0'){
    res += months_id[Number(date[6])]+" "
  }else{
    res += months_id[Number(monthNumber)-1]+" "
  }

  res += yearNumber
  return res
}

export default convertDate