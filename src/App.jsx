import React from "react";
import Login from "./Page/Login";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import NotLoggedIn from "./Page/NotLoggedIn";
import LoggedIn from "./Page/LoggedIn";

const queryClient = new QueryClient()

const ProtectedLogin = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    if (token !== null) {
        navigate('/')
    } else {
        <Outlet />
    }
}

const App = () => {
    return (
       <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/landingpage" element={<NotLoggedIn />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<LoggedIn />} />
                </Route>
            </Routes>
        </BrowserRouter>
       </QueryClientProvider>
    )
}

export default App;