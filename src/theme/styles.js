// eslint-disable-next-line import/no-extraneous-dependencies
import { mode } from "@chakra-ui/theme-tools";

// Color theme
export const colors = {
  brand: {
    "base-dark": "#282828",
    "base-light": "#FFFFFF",
    blue: "#2856AD",
    green: "#38A169",
    red: "#E53E3E",
    gray: "#D9D9D9",
  },
};

// Global overrides
export const global = (props) => ({
  body: {
    color: mode("brand.base-dark", "brand.base-light")(props),
    bg: mode("brand.base-light", "brand.base-dark")(props),
  },
});

const styles = {
  global,
};

export default styles;
