import Fuse from 'fuse.js';

let fuse;
let custom = null;
export const getEmojiFuse = (store) => {
  if (custom !== store.getState().emojis) {
    custom = store.getState().emojis;
    fuse = new Fuse(custom.filter((e) => !e.empty), {
      keys: [
        'name',
        'shortname',
      ],
    });
  }
  return fuse;
};

export const loadEmojis = () => async (dispatch) => Promise.all([
  dispatch.methods.emojis.loadJSON(),
  dispatch.methods.emojis.loadCustom(),
]);
