
const CHARSET = 'abcdefghigklmnopqrstuvwxyz';
const NUMSET = '0123456789';
const ALL = CHARSET + NUMSET;

export function uid(length?: number) {
  const n = length || 6;
  if (n < 4) {
    throw new RangeError('length must be > 4');
  }

  let rs = '';
  for (let i = 0; i < n - 2; i++) {
    rs += 'z';
  }

  return (`xx${rs}`).replace(/[xz]/g, c => (c === 'x' ?
    CHARSET[Math.random() * 26 | 0] :
    ALL[Math.random() * 36 | 0]));
}

export function getReqId(defaultNum?: number) {
  if (!defaultNum) {
    return Math.floor(Math.random() * 100000);
  }

  let thousandsDigit = Math.floor(defaultNum / 10000);
  const baseBum = defaultNum % 10000;
  return (thousandsDigit + 1) * 10000 + baseBum;
}