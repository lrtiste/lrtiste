const key = ev => ({key: ev.key, keyCode: ev.keyCode, code: ev.code});
const checkKey = (keyName, keyCode) => ev => {
  const k = key(ev);
  return k.key ? k.key === keyName : k.keyCode === keyCode;
};

export const isArrowLeft = checkKey('ArrowLeft', 37);
export const isArrowUp = checkKey('ArrowUp', 38);
export const isArrowRight = checkKey('ArrowRight', 39);
export const isArrowDown = checkKey('ArrowDown', 40);
export const isEscape = checkKey('Escape', 27);
export const isEnter = checkKey('Enter', 13);
export const isSpace = ev => {
  const k = key(ev);
  return k.code ? k.code === 'Space' : k.keyCode === 32;
};