import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context";
import { Container } from 'semantic-ui-react'

const app = (
    <ContextProvider>
        <BrowserRouter>
            <Container>
                <Routes />
            </Container>
        </BrowserRouter>
    </ContextProvider>
);

ReactDOM.render(app, document.getElementById("root"));
