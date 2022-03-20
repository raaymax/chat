
export const h = (name, attr = {}, children = []) => {
  const el = document.createElement(name);
  Object.entries(attr)
    .forEach(([key, val]) => el.setAttribute(key, val));
  children.forEach(child => el.appendChild(child))
  return el;
}
export const t = (text) => document.createTextNode(text);

export const formatTime = (raw) => {
  const date = new Date(raw);
	let minutes = date.getMinutes().toString();
	if(minutes.length == 1) minutes = `0${minutes}`;
  return `${date.getHours()}:${minutes}`
} 
