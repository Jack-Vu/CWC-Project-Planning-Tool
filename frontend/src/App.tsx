import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "./Components";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { theme } from "./theme";
import "@fontsource/pacifico";
import "@fontsource/sometype-mono";

export type Data = {
  email: string;
  name: string;
  username: string;
};

export type Context = {
  loggedIn: boolean;
  toggledLoggedIn: () => void;
};

function App() {
  const data = useLoaderData() as Data | undefined;
  const [loggedIn, setLoggedIn] = useState(data?.username !== undefined);

  const toggledLoggedIn = () => {
    setLoggedIn(!loggedIn);
  };

  const context: Context = {
    loggedIn,
    toggledLoggedIn
  };
  return (
    <ChakraProvider theme={theme}>
      <Header loggedIn={loggedIn} />
      <Outlet context={context} />
    </ChakraProvider>
  );
}

export default App;
