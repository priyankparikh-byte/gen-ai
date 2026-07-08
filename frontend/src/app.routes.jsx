import { createBrowserRouter, Navigate } from "react-router";
import Login from "./feautres/auth/pages/login.jsx";
import Register from "./feautres/auth/pages/Register.jsx";
import Protected from "./feautres/auth/components/protected.jsx"
import Home from "./feautres/interview/pages/home.jsx"
import Interview from "./feautres/interview/pages/interview.jsx";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Home/></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }
]);