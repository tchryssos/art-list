import { encode } from 'html-entities';

/* eslint-disable no-restricted-syntax */
export const formDataToJson = (
  data: FormData,
  addlData?: Record<string, unknown>
) => {
  let dataObj: Record<string, unknown> = {};

  for (const entry of data.entries()) {
    const [key, val] = entry;
    if (typeof val === 'string') {
      dataObj[key] = encode(val);
    }
  }

  dataObj = { ...dataObj, ...addlData };

  return JSON.stringify(dataObj);
};

/**
 * Converts FormData to a plain object suitable for localStorage persistence.
 * Unlike formDataToJson, this preserves raw values without HTML encoding.
 */
export const formDataToObject = (data: FormData): Record<string, unknown> => {
  const dataObj: Record<string, unknown> = {};

  for (const entry of data.entries()) {
    const [key, val] = entry;
    dataObj[key] = val;
  }

  return dataObj;
};
