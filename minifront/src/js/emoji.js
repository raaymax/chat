
export const emojiPromise = (async () => {
  const res = await fetch('/assets/emoji_list.json');
  return await res.json();
})();
