import UserContext from "./components/AccountContext";
import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./components/Views";
// import Header from './components/Header';
import * as React from 'react';

// 1. import `ChakraProvider` component
// import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
      <UserContext>
        {/* <Header /> */}
        <Views />
        <ToggleColorMode />
      </UserContext>
  );
}

export default App;
