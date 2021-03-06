/* eslint-disable @typescript-eslint/no-explicit-any */

// Ported to TypeScript from:
// https://github.com/joaquimserafim/isJSON

function isString(x: string) {
  return Object.prototype.toString.call(x) === '[object String]'
}

function isObject(obj: {}) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isJSON(str: any, passObject?: boolean): boolean {
  if (passObject && isObject(str)) {
    return true
  }

  if (!isString(str)) {
    return false
  }

  // eslint-disable-next-line no-param-reassign
  str = str.replace(/\s/g, '').replace(/\n|\r/, '')

  if (/^\{(.*?)\}$/.test(str)) {
    return /"(.*?)":(.*?)/g.test(str)
  }

  if (/^\[(.*?)\]$/.test(str)) {
    return (
      str
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/},{/g, '}\n{')
        .split(/\n/)
        .map((s: any) => isJSON(s))
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore: 'prev' must be defined but is unused.
        .reduce((prev: any, curr: any) => !!curr)
    )
  }

  return false
}

export function isJSONStrict(str: any) {
  if (isObject(str)) {
    return true
  }

  try {
    return JSON.parse(str) && true
  } catch (ex) {
    return false
  }
}

export default isJSON
