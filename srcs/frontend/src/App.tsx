import './App.css';
import axios from 'axios';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home';
import Game from './Game';

axios.defaults.baseURL = 'http://127.0.0.1:3000';

let router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      return Home();
    },
  },
  {
    path: "/game",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      return Game();
    },
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
