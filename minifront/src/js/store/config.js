
let set = null
let config = new Promise((resolve) => set = resolve);

export const getConfig = () => config;
export const setConfig = (c) => set(c); 
