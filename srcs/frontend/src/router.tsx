// import Home from './pages/Home';
// import Game from './pages/Game';
// import Sidebar from './pages/Sidebar';
// import { createBrowserRouter } from "react-router-dom";
// import TestDB from './pages/TestDB';
// import Profile from './pages/Profile';
// import {Login, Signin, Signup, LandingPage} from './pages/Login';

// const router = createBrowserRouter([
// 	{
// 		path: "/test-db",
// 		loader: () => ({ message: "Hello Data Router!" }),
// 		Component() {
// 			return TestDB();
// 		},
// 	},
// 	{
// 		path: "/",
// 		loader: () => ({ message: "Hello Data Router!" }),
// 		Component() {
// 			return Home();
// 		},
// 	},
// 	{
// 		path: "/profile",
// 		loader: () => ({ message: "Hello Data Router!" }),
// 		Component() {
// 			return Profile();
// 		},
// 	},
// 	{
// 		path: "/login",
// 		element: <Login />,
// 		children: [
// 			{
// 				path: "signin",
// 				element: <Signin />,
// 			},
// 			{
// 				path: "signup",
// 				element: <Signup />,
// 			},
// 			{
// 				index: true,
// 				element: <LandingPage />,
// 			},
// 		],
// 	},
// 	{
// 		path: "/game",
// 		loader: () => ({ message: "Hello Data Router!" }),
// 		Component() {
// 			return Game();
// 		},
// 	},
// 	{
// 		path: "/sidebar",
// 		Component() {
// 			return Sidebar();
// 		},
// 	},
// ]);

// export default router;

export {};
