/* eslint-disable no-restricted-syntax */
export const formDataToJson = (data: FormData) => {
  const dataObj: Record<string, unknown> = {};

  // @ts-expect-error TS warns about .entries
  // as its not supported in IE
  for (const entry of data.entries()) {
    const [key, val] = entry;
    dataObj[key] = val;
  }

  return JSON.stringify(dataObj);
};
