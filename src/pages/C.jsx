import React, { useEffect, useState } from "react";

import initializeSocket from "../sockets/sockets";

export default function C() {
  const [ws, setWs] = useState(null);
  const [isModify, setIsModify] = useState("adam");
  const [isOnly, setIsOnly] = useState("1");

  const startWebSocket = () => {
    const login = {
      modifyCode: isModify,
      onlyCode: isOnly,
    };
    const getSocket = initializeSocket(true, JSON.stringify(login));
    console.log(getSocket);
    setWs(getSocket);
  };
  const closeSocket = () => {
    localStorage.clear();
    sessionStorage.clear();
    ws?.close();
    setWs(null);
  };
  const roomEmit = () => {
    ws.emit("customEvent", "測試");
  };

  const checkRoom = () => {
    ws.emit("checkRoom", "checkRoom");
  };

  useEffect(() => {
    if (!!ws) {
      ws.on("repeatLogin", (msg) => {
        console.log(msg);
      });
      ws.on("disconnect", () => {
        console.log("以斷開連線");
      });
      ws.on("adam", (msg) => {
        console.log(msg);
      });
    }
  }, [ws]);

  return (
    <div className="App-header">
      <h1>C</h1>
      <label htmlFor="modifyCode">
        <input
          type="text"
          id="modifyCode"
          value={isModify}
          onChange={(e) => setIsModify(e.target.value)}
        />
      </label>
      <label htmlFor="onlyCode">
        <input
          type="text"
          id="onlyCode"
          value={isOnly}
          onChange={(e) => setIsOnly(e.target.value)}
        />
      </label>
      <input type="button" value="登入" onClick={startWebSocket} />
      <input type="button" value="確認房間" onClick={checkRoom} />
      <input type="button" value="多人連線接收訊息測試" onClick={roomEmit} />
      <input type="button" value="中斷連線" onClick={closeSocket} />
    </div>
  );
}
