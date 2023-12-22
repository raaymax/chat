/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const fs = require('node:fs/promises');

const CATEGORIES = {
  'Smileys & Emotion': 'p',
  'People & Body': 'b',
  Component: 'e',
  'Animals & Nature': 'n',
  'Food & Drink': 'd',
  'Travel & Places': 't',
  Activities: 'a',
  Objects: 'o',
  Symbols: 's',
  Flags: 'k',
};

const RENAMES = {
  ':grinning_face_with_sweat:': ':sweat_smile:',
  ':winking_face:': ':wink:',
  ':downcast_face_with_sweat:': ':sweat:',
  ':grinning_face_with_big_eyes:': ':smiley:',
  ':grinning_face_with_smiling_eyes:': ':smile:',
  ':face_with_tears_of_joy:': ':joy:',
  ':beaming_face_with_smiling_eyes:': ':grin:',
};

const applyRename = (shortname) => {
  if (RENAMES[shortname]) return RENAMES[shortname];
  return shortname;
};

async function parse(file) {
  const data = await fs.readFile(file, 'utf-8');
  const cat = new Set();
  const emojis = [];
  const lines = data.split('\n');
  let group = '';
  let subgroup = '';
  for (const line of lines) {
    if (line.startsWith('# group:')) {
      group = line.slice(9);
      continue;
    }
    if (line.startsWith('# subgroup:')) {
      subgroup = line.slice(12);
      continue;
    }
    if (line.startsWith('#')) continue;
    if (!line) continue;
    const [emoji, desc] = line.split(';');
    const [qualification, n0] = desc.split('#');
    if (qualification.trim() !== 'fully-qualified') continue;

    const m = n0.match(/E\d+.\d+ (.*)/);
    if (!m) continue;
    const fullName = m[1].replaceAll('flag: ', 'flag_');
    cat.add(group);
    const [name, components] = fullName.split(':');
    emojis.push({
      unicode: emoji.trim().split(' '),
      shortname: applyRename(`:${fullName.replaceAll(': ', '+').replaceAll(', ', '+').replaceAll(/[\s]+/g, '_')}:`),
      // fullname: `${fullName.replaceAll(': ', '+').replaceAll(', ', '+').replaceAll(/[\s]+/g, '_')}`,
      // path: fullName.replaceAll(': ', '+').replaceAll(', ', '+').replaceAll(/[\s]+/g, '_').split('+'),
      category: CATEGORIES[group],
      name,
      components: (components ? components.split(/,\s*/g) : []).map((c) => c.trim().replaceAll(' ', '_')),
      group,
      subgroup,
    });
  }
  /* const tree = Object.fromEntries(emojis.map(e => [e.fullname, e]));
  for (const emoji of emojis) {
    tree[emoji.path.slice(0, -2)] = emoji;
    emoji.parent = tree[emoji.path.slice(0, -1).join('+')];
  }
  */

  console.log(cat);
  return emojis.filter((e) => e.components.length === 0).map((e) => ({
    unicode: e.unicode,
    shortname: e.shortname,
    category: e.category,
    name: e.name,
    group: e.group,
    subgroup: e.subgroup,

  }));
}

async function main() {
  const emojis = await parse('./emojis11.txt');
  // console.log(emojis);
  fs.writeFile('../packages/app/src/assets/emojis.json', JSON.stringify(emojis, null, 2));
}

main();
