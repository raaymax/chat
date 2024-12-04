const __dirname = new URL(".", import.meta.url).pathname;
let text = Deno.readTextFileSync(__dirname + "/themes.json");

text = text.replaceAll(/Secondary Button \(Icons\)/g, "SecondaryButton");
text = text.replaceAll(/Primary Button/g, "PrimaryButton");
text = text.replaceAll(/Progress Indicator 100%/g, "ProgressDone");
text = text.replaceAll(/Reaction button/g, "ReactionButton");
text = text.replaceAll(/Input active/g, "InputActive");
text = text.replaceAll(/Toggle Buttons/g, "ToggleButtons");
text = text.replaceAll(/Active overlay/g, "ActiveOverlay");

const json = JSON.parse(text);

const modes = json.collections[0].modes;
console.log(modes);
const themes: any = {};

const icons: any = {
  dark: "moon",
  light: "sun",
  test: "vail",
  "dark-orange-test": "carrot",
};
const legacyParams: any = {
  borderColor: "#565856",
  backgroundColor: "#1a1d21",
  highlightedBackgroundColor: "#2a2d31",
  inputBackgroundColor: "#2a2d31",
  dateBarBackgroundColor: "#2a2d31",
  fontColor: "#d9d9d9",
  frontHoverColor: "var(--primary_active_mask)",

  userActive: "#3c7e3c",
  userConnected: "#8f8f45",
  userSystem: "#d9d9d9",
  userDisconnected: "#4f4f4f",

  actionButtonBackgroundColor: "#2E1A4E",
  actionButtonHoverBackgroundColor: "#3D2760",
  actionButtonActiveBackgroundColor: "#3D2760",
  actionButtonFontColor: "#d9d9d9",

  buttonHoverBackground: "#3D2760",
  buttonActiveBackground: "#3D2760",

  borderColorHover: "white",

  searchBoxBackgroundColor: "#2a2d31",
  labelColor: "gray",

  linkColor: "#4a90e2",
  mentionsColor: "#4ac0e2",
};

for (const mode of modes) {
  const id = mode.name.toLowerCase().replace(" ", "-");
  themes[id] = {
    name: mode.name.replaceAll("-", " "),
    icon: icons[id] ?? "icons",
    ...legacyParams,
  };

  for (const v of mode.variables) {
    const path = v.name.split("/").filter((p) => p !== "Buttons");
    let target = path.slice(0, -1).reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, themes[id]);
    target[path[path.length - 1]] = v.value;
  }
}

Deno.writeTextFileSync(
  __dirname + "/themes-imported.ts",
  `export const themes = ${JSON.stringify(themes, null, 2)};`,
);
