export const isFile = (val: unknown): val is File => {
  return val instanceof File
}

export const isNull = (val: unknown): val is null => {
  return val === null
}