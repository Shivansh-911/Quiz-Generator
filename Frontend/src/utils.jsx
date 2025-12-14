import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
export const handleError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("loggedInUser")
    localStorage.removeItem("quizAppState")
    setTimeout(() => {
    }, 2000)
}

export const checkTokenValidity = () => {
    const token = localStorage.getItem('Token');
    if (!token){
        handleLogout()
        return false};

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if(decoded.exp > currentTime){
            return true;
        } 
        else{
            handleLogout()
            return false;
        }// Check if token is still valid
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
};