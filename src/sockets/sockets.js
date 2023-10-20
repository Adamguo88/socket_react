// import websocket from "socket.io-client";
// const sessionPagination = sessionStorage.getItem("tokenNum");
// const isLogin = localStorage.getItem("userIsLogin");
// // const startLogin = !!isLogin
// //   ? websocket("http://localhost:8080", {
// //       query: { userID: sessionPagination + "用戶" },
// //     })
// //   : null;

// let socket = null;
// (() => {
//   let time = null;
//   if (!!isLogin) {
//     socket = websocket("http://localhost:8080", {
//       query: { userID: sessionPagination + "用戶" },
//     });
//     console.log(socket);
//     if (!!socket) {
//       time = setInterval(() => {
//         socket.emit("setInterval", `這個人還活著 - ${sessionPagination}`);
//       }, 5000);
//     }
//   }
//   window.addEventListener("unload", () => {
//     clearInterval(time);
//   });
//   return socket;
// })();

// export default socket;

import websocket from "socket.io-client";

let socket = null;

export default function initializeSocket(isLogin, sessionPagination) {
  if (!!isLogin) {
    socket = websocket("http://localhost:8080", {
      query: { user: sessionPagination },
    });

    if (!!socket) {
      setInterval(() => {
        socket.emit("setInterval", `這個人還活著 - ${1}`);
      }, 5000);
    }
  }

  window.addEventListener("unload", () => {
    if (socket) {
      socket.disconnect();
    }
  });

  return socket;
}
