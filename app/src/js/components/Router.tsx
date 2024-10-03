//import { Workspace } from './pages/Workspace';
import { Main } from './pages/Main';
import { MainConversation } from './pages/MainConversaion';
import { Search } from './pages/Search';
import { Pins } from './pages/Pins';
import { Workspace } from './pages/Workspace';

import {
  createHashRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";


const router = createHashRouter([
  { 
    element: <Main><Outlet /></Main>,
    children: [
      {
        path: "/:channelId/search",
        element: <Search />,
      },
      {
        path: "/:channelId/pins",
        element: <Pins />,
      },
    ]
  },
  {
    path: "/*",
    element: <Workspace />,
  },
]);

export const Router= () => {
  return (
    <RouterProvider router={router} />
  );
};

