import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `'Pacifico', cursive`,
    body: `"Sometype Mono", monospace`
  },
  layerStyles: {
    heading: {
      color: "#3bb4ff"
    },
    text: {
      color: "#170c35"
    }
  },
  styles: {
    global: () => ({
      body: {
        bg: "#f7e8d5"
      }
    })
  }
});
