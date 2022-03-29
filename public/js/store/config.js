let set = null;
const config = new Promise((resolve) => { set = resolve; });

export const getConfig = () => config;
export const setConfig = (c) => set(c);
