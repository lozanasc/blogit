// eslint-disable-next-line import/no-extraneous-dependencies
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

import styles, { colors } from "./styles";

const customTheme = {
  colors,
  styles,
  fonts: {
    heading: "'montserrat', sans-serif",
    body: "'inter', sans-serif",
  },
  config: {
    initialColorMode: "dark",
  },
  components: {
    modal: {
      baseStyle: {
        color: mode("brand.base-dark", "brand.base-light"),
        bg: mode("brand.base-light", "brand.base-dark"),
      },
    },
  },
};

const theme = extendTheme(customTheme);

export default theme;
