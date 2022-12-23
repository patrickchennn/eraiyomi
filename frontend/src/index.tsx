import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './components/ErrorPage';
import Layout from './components/Layout';

import Article1 from './pages/article1/Article1';
import Article2 from './pages/article2/Article2';
import Article3 from './pages/article3/Article3';

const rootElement = document.getElementById('root') as HTMLDivElement
const root = ReactDOM.createRoot(rootElement)


const router = createBrowserRouter([
  {
    element: <Layout rootElement={rootElement}/>,
    // errorElement: <ErrorPage />,
    children:[
      {
        path: "/",
        element: <App rootElement={rootElement}/>,
      },
      {
        path: "/article1",
        element: <Article1 />
      },
      {
        path: "/article2",
        element: <Article2 />
      },
      {
        path: "/article3",
        element: <Article3 />
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
