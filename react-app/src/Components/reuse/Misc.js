import Axios from "axios";

export const getUser = () => {
    return Axios({
        method: "GET",
        withCredentials: true,
        url: "/auth/user",
    }).then((res) => {
        if (res.data) {
            localStorage.setItem("User", JSON.stringify(res.data));
            window.dispatchEvent(new Event('storage'))
            return res.data;
        } else {
            console.log("No user logged in");
            return null;
        }
    });
};

export const logout = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: "auth/logout",
    }).then((res) => {
        console.log(res)
        localStorage.removeItem("User");
        window.dispatchEvent(new Event('storage'))
        window.location.href = '/login';
    });
}