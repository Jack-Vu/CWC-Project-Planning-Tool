import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "./Components";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Outlet />
    </ChakraProvider>
  );
}

export default App;
