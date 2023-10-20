import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "../App";
import A from "../pages/A";
import B from "../pages/B";
import C from "../pages/C";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "a",
    element: <A />,
  },
  {
    path: "b",
    element: <B />,
  },
  {
    path: "c",
    element: <C />,
  },
]);

export default function RouterApp() {
  return <RouterProvider router={router} />;
}
