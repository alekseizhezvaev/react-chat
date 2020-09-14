import React from "react";
import { Switch, Route } from "react-router-dom";
import App from "./App";
import FormRoom from "./components/FormRoom/FormRoom";
import Room from "./components/Room/Room";

export default () => {
    return (
        <Switch>
            <Route exact path="/" component={App} />
            <Route
                path="/join-room"
                render={({ location }) => (
                    <FormRoom
                        title="Enter the room"
                        roomId={location.state.roomId}
                        isJoin={true}
                    />
                )}
            />
            <Route
                path="/create-room"
                render={() => <FormRoom title="Enter the room" />}
            />
            <Route path="/room/:id" component={Room} />
        </Switch>
    );
};
