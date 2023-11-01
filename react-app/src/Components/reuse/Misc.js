import Axios from "axios";

export const getUser = () => {
    return Axios({
        method: "GET",
        withCredentials: true,
        url: urlPrefix() + "auth/user",
    }).then((res) => {
        if (res.data) {
            if (res.data.sucess) {
                localStorage.setItem("User", JSON.stringify(res.data));
                window.dispatchEvent(new Event('storage'))
                return res.data;
            }
            else {
                return res.data;
            }
        } else {
            logout();
            return null;
        }
    });
};

export const logout = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: urlPrefix() + "auth/logout",
    }).then((res) => {
        localStorage.removeItem("User");
        window.dispatchEvent(new Event('storage'))
        window.location.href = '/login';
    });
}

export const logoutWNRedirect = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: urlPrefix() + "auth/logout",
    }).then((res) => {
        localStorage.removeItem("User");
        window.dispatchEvent(new Event('storage'))
    });
}

export const urlPrefix = () => {
    if (window.location.origin.includes("localhost")) {
        return "http://localhost:3200/"
    }
    else {
        return "https://progbackend.techsyndicate.us/";
    }
};

export const checkLoggedIn = () => {
    if (localStorage.getItem("User")) {
        return Axios({
            method: "GET",
            withCredentials: true,
            url: urlPrefix() + "auth/user",
        }).then((res) => {
            if (res.data && res.data.sucess) {
                localStorage.setItem("User", JSON.stringify(res.data));
                window.dispatchEvent(new Event('storage'))
                return true;
            } else {
                logoutWNRedirect();
                return null;
            }
        });
    }
    else {
        return null;
    }
}

export const langParser = (val) => {
    if (val === 'python3' || val === 'python2') {
        return ('python');
    }
    else if (val === 'gpp') {
        return ('cpp');
    }
    else if (val === 'gcc') {
        return ('c');
    }
    else if (val === 'mcs') {
        return ('csharp');
    }
    else if (val === 'javascript') {
        return ('javascript');
    }
    else return (val);
}

export const langParserForSubmission = (val) => {
    if (val === 'python3') {
        return ('Python 3');
    }
    else if (val === 'python2') {
        return ('Python 2');
    }
    else if (val === 'javascript'){
        return ('JavaScript');
    }
    else if (val === 'gpp') {
        return ('C++');
    }
    else if (val === 'gcc') {
        return ('C');
    }
    else if (val === 'mcs') {
        return ('C#');
    }
    else return (val);
}