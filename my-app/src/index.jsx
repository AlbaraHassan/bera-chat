import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import App from './App';
import ChatProvider from './Context/charProvider';

ReactDOM.render(
    <ChatProvider>
        <BrowserRouter forceRefresh={true}>
        <ChakraProvider>
            <App />
        </ChakraProvider>
        </BrowserRouter>
    </ChatProvider>,
    document.getElementById('root')
);