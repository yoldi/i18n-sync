export const toMap = <Value extends any>(
  obj: { [key: string]: Value },
  { key, value }: { key: string; value: Value }
) => {
  obj[key] = value;
  return obj;
};
