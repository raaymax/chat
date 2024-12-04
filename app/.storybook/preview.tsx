import type { Preview } from "@storybook/react";
import StoreProvider from "../src/js/store/components/provider";
import { ThemeSelectorProvider } from "../src/js/components/contexts/theme";
import { TooltipProvider } from "../src/js/components/contexts/tooltip";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: "Dark", value: "var(--background-color)" },
        { name: "Light", value: "var(--background-color)" },
      ],
      default: "Dark",
    },
  },
  decorators: [
    (Story, args) => (
      <StoreProvider>
        <ThemeSelectorProvider value={args.globals.theme}>
          <TooltipProvider>
            <Story />
          </TooltipProvider>
        </ThemeSelectorProvider>
      </StoreProvider>
    ),
  ],
};

export default preview;
