import { IProductAttribute } from "../types";

export const parseCookies = (headerCookies: string) => {
  if (!headerCookies) return [];
  const cookies = headerCookies.split(";");
  const cookiesArray = cookies.map((cookie) => {
    let [name, ...rest] = cookie.split("=");

    name = name.trim();
    const value = rest.join("=").trim();

    return { name, value };
  });

  return cookiesArray;
};

export const selectDefaultAttributes = (attributes: IProductAttribute[]): IProductAttribute[] => {
  return attributes.map((attr) => ({ ...attr, values: [attr.values[0]] }));
};

export function manipulateDescription(text: string | null) {
  if (!text) return ["", ""];
  if (text.length < 170) return [text, ""];
  return [text.slice(0, 170), text.slice(170)];
}
