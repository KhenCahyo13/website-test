import { Navigate, Outlet } from "react-router-dom"

const useAuth = () => {
    const token = localStorage.getItem('token')
    let user = { loggedIn : false }
    if (token === null) {
        user = { loggedIn : false }
    } else {
        user = { loggedIn : true }
    }
    return user && user.loggedIn
}

const ProtectedRoute = () => {
    const isAuth = useAuth()
    return isAuth ? <Outlet /> : <Navigate to="/landingpage" />
}

export default ProtectedRoute;