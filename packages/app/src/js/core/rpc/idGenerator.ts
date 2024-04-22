const ID = (Math.random() + 1).toString(36).substring(2, 15);
let nextSeq = 0;
export const genSeqId = () => `${ID}:${nextSeq++}`;
