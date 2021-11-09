/**
 * 日時を整形する
 * @param date
 * @returns string
 */
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = zeroFill(date.getHours(), false);
  const minute = zeroFill(date.getMinutes(), false);
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
};

/**
 * 10未満の数値を0埋めする
 * @param checkedNum
 * @param isMonth 月の場合は1加算
 * @returns
 */
const zeroFill = (checkedNum: number, isMonth: boolean) => {
  let threshold;
  isMonth === true ? (threshold = 9) : (threshold = 10);
  return (checkedNum < threshold ? '0' : '') + checkedNum;
};

export { formatDate };
