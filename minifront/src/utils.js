
export const h = (name, attr = {}, children = []) => {
  const el = document.createElement(name);
  Object.entries(attr)
    .forEach(([key, val]) => el.setAttribute(key, val));
  children.forEach(child => el.appendChild(child))
  return el;
}
export const t = (text) => document.createTextNode(text);
