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
    },
    boxButton: {
      border: "1px solid #170c35",
      borderRadius: "md",
      bgColor: "white",
      boxShadow: "md",
      _active: { transform: "scale(1)" },
      _hover: {
        cursor: "pointer",
        transform: "scale(1.005)"
      }
    },
    accordionButton: {
      bgColor: "rgb(69, 98, 106, 0.75)",
      borderTopRadius: "md",
      _active: { transform: "scale(1)" }
    },
    accordionPanel: {
      bg: "white",
      borderBottomRadius: "md"
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
