import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const App = () => {
    const history = useHistory();
    const [shareParams] = useState(() => {
        const query = new URLSearchParams(history.location.search);
        const roomId = query.get("roomId");

        return {
            isShare: Boolean(roomId),
            roomId,
        };
    });

    //При рендере проверяется ссылка
    useEffect(() => {
        if (shareParams.isShare) {
            history.push("/join-room", { roomId: shareParams.roomId  });
            return;
        }
        history.push("/create-room");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default App;
