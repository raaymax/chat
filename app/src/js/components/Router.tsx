import { Main } from './layout/Main';
import { Discussion } from './layout/Discussion';
import { Search } from './pages/Search';
import { Pins } from './organisms/Pins';
import { redirect, useRouteError } from 'react-router-dom';
import { client, ApiError } from '../core'

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
        loader: async ({ params }) => {
          const {channelId} = params;
          if(!channelId) throw new Error('Page not found');
          const channel = await client.api.getChannelById(channelId);
          if (!channel) throw new Error('Page not found');
          return null;
        },
        element: <Discussion />,
        errorElement: <ErrorBoundary/>,
      },
      {
        path: "/:channelId/search",
        element: <Discussion><Search /></Discussion>,
      },
      {
        path: "/:channelId/pins",
        element: <Discussion><Pins /></Discussion>,
      },
      {
        path: "/:channelId/t/:parentId",
        element: <Discussion/>,
      },
    ],
    errorElement: <ErrorBoundary/>,
  },
  {
    path: "/*",
    loader: async () => {
      const {mainChannelId} = await client.api.getUserConfig()
      return redirect(`/${mainChannelId}`);
    },
    errorElement: <ErrorBoundary/>,
  },
]);

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  if (error instanceof ApiError) {
    return (
      <div>
        <div>
          error - <button onClick={() => document.location.reload()}>try again</button>
        </div>
        <h2>{error.message}</h2>
        <pre>
          {error.url}
        </pre>
        <pre>
          {error.stack}
        </pre>
        <pre>
          {error.payload && JSON.stringify(error.payload, null, 2)}
        </pre>
      </div>
    );
  }
  if (error instanceof Error) {
    return (
      <div>
        <div>
          error - <button onClick={() => document.location.reload()}>try again</button>
        </div>
        <h2>{error.message}</h2>
        <pre>
          {error.stack}
        </pre>
      </div>
    );
  }

  return <div>error - <button onClick={() => document.location.reload()}>try again</button></div>;
}

export const Router= () => {
  return (
    <RouterProvider router={router} />
  );
};

