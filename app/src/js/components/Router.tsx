import { Main } from './layout/Main';
import { Discussion } from './pages/Discussion';
import { Search } from './pages/Search';
import { Pins } from './pages/Pins';

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
        path: "/:channelId",
        element: <Discussion/>,
      },
      {
        path: "/:channelId/search",
        element: <Search />,
      },
      {
        path: "/:channelId/pins",
        element: <Pins />,
      },
      {
        path: "/:channelId/t/:parentId",
        element: <Discussion/>,
      },
    ]
  },
  {
    path: "/*",
    element: <Main><Discussion/></Main>,
  },
]);

export const Router= () => {
  return (
    <RouterProvider router={router} />
  );
};

