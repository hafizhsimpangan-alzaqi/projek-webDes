// backend/helper/auth.js
const session = require("../storage/session");

function getCookie(req, cookieName){
    const cookie = req.headers.cookie; //pendefinisian & pembuatan cookie

    if (!cookie) { //jika tidak ada cookie
        return null;
    }

    const cookies = cookie.split(";");

    for (let item of cookies) {
        const parts = item.trim().split("=");
        
        const key =parts[0];
        const value = parts[1];

        if (key === cookieName) {
            return value;
        }
    }

    return null;
}

function getUserSession(req){

    const sessionId = getCookie(
        req,
        "sessionId"
    );

    if(!sessionId){
        return null;
    }

    const userSession = session[sessionId];

    if(!userSession){
        return null;
    }

    const oneDay =
        24 * 60 * 60 * 1000;

    if(
        Date.now()
        - userSession.lastActivity
        > oneDay
    ){
        delete session[sessionId];
        return null;
    }

    userSession.lastActivity = Date.now(); //digunakan agar session aktif terus apabila masih menggunakan applikasi
    return userSession.user;
}

//Helper untuk Authorization(Hak Akses)
function requireTeacher(req){
    const user = getUserSession(req);

    if(!user){
        return null;
    }

    if(user.role !== "teacher"){
        return false;
    }

    return user;
}

//digunakan untuk mengekspor modul atau fungsi yang ada di file ini.
module.exports ={
    getCookie,
    getUserSession,
    requireTeacher
}