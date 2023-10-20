import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import websocket from "socket.io-client";

import "./App.css";
function App() {
  const heartbeatRef = useRef();
  const [ws, setWs] = useState(null);
  const [isLogin, setIsLogin] = useState("");

  const startWebSocket = () => {
    sessionStorage.setItem("tokenNum", isLogin);
    const socket = websocket("http://localhost:8080", {
      query: { userID: isLogin + "用戶" },
    });
    console.log(socket);
    setWs(socket);
  };

  // const initWebSocket = () => {
  //   //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
  //   ws.on("getMessage", (message) => {
  //     console.log(message);
  //   });
  // };

  const sendChart = () => {
    const sessionPagination = sessionStorage.getItem("tokenNum");
    ws.send(`用戶${sessionPagination} : 向服務器端送出訊息`);
  };

  const sendMessage = () => {
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    ws.emit("getMessage", "只回傳給發送訊息的 client");
  };

  const heartbeat = () => {
    const sessionPagination = sessionStorage.getItem("tokenNum");
    heartbeatRef.current = setInterval(() => {
      ws.emit("heartbeat", `心跳測試-用戶${sessionPagination}`);
    }, 1000);
  };
  const closeHeartbeat = () => {
    clearInterval(heartbeatRef.current);
  };

  const closeSocket = () => {
    sessionStorage.clear();
    ws?.close();
    setWs(null);
  };

  useEffect(() => {
    if (!!ws) {
      ws.on("reconnect", (msg) => {
        console.log("客戶端重新連線", msg);
      });
      ws.on("socketID", (msg) => {
        if (!!msg) {
          sessionStorage.setItem("socketID", msg);
        }
        console.log(msg, "我的編號是");
      });

      ws.on("getMessage", (message) => {
        console.log(message);
      });
      ws.on("message", (msg) => {
        if (!!msg) {
          console.log(msg);
          const getSocketID = sessionStorage.getItem("socketID");
          ws.emit("logout", getSocketID);
          clearInterval(heartbeatRef.current);
        }
      });
    }
    return () => {
      ws?.close();
      clearInterval(heartbeatRef.current);
    };
  }, [ws]);

  return (
    <div className="App">
      <div className="flex">
        <ul className="flex">
          <li className="mr">
            <Link to="/">首頁</Link>
          </li>
          <li className="mr">
            <Link to="a">測試1</Link>
          </li>
          <li className="mr">
            <Link to="b">測試2</Link>
          </li>
          <li className="mr">
            <Link to="c">測試3</Link>
          </li>
        </ul>
      </div>
      <div className="App-header">
        <label htmlFor="login">
          登入帳號
          <input
            type="text"
            name="login"
            id="login"
            value={isLogin}
            onChange={(e) => setIsLogin(e.target.value)}
          />
        </label>
        <input type="button" value="連線" onClick={startWebSocket} />
        <input type="button" value="送出訊息" onClick={sendMessage} />
        <input type="button" value="聊天室測試" onClick={sendChart} />
        <input type="button" value="心跳測試" onClick={heartbeat} />
        <input type="button" value="關閉心跳" onClick={closeHeartbeat} />
        <input type="button" value="中斷連線" onClick={closeSocket} />
      </div>
    </div>
  );
}

export default App;
