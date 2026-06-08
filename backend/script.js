//https://nodejs.org/learn/getting-started/introduction-to-nodejs

const { URL } = require('node:url');
const { createServer } = require('node:http'); //pemanggilan fungsi createServer dari module http
const { json } = require('node:stream/consumers'); //pemanggilan fungsi json dari module stream/consumers
const conn = require('./config/db'); //pemanggilan untuk terkoneksi ke database
const crypto = require("node:crypto");

//deklarasi hostname dan port
const hostname = '127.0.0.1';
const port = 8080;

//deklarasi session
const session = {}

//fungsi helper
function getUserSession(req) {
    const cookie = req.headers.cookie;

    if (!cookie) {
        return null;
    }

    const sessionId = cookie.split("=")[1];

    return session[sessionId];
}

function sendJson(res,statusCode,data){
    res.writeHead(statusCode,{
        'Content-Type':'application/json'
    });

    res.end(JSON.stringify(data));
}

//pembuatan server dengan menggunakan fungsi createServer
const server = createServer((req, res) => {
    //deklarasi URL
    const url = new URL(req.url, `http://${req.headers.host}`);


    if (url.pathname === "/user") {

        let id = url.searchParams.get("id");
        if (!id) {
            res.statusCode=400;
            res.end(JSON.stringify({
                success:false,
                message:"Parameter harus disi"
            }));
            return;
        }

        conn.query("SELECT * FROM users WHERE id = ?", [id], function(err,result){
            if(err){
                console.log(err);
                sendJson(res,500,{
                    success:false,
                    message:"Server error"
                });
                return;
            }
            
            if (result.length === 0) { //validasi jika akun tidak ditemukan
                sendJson(res,404,{
                    success:false,
                    message:"Akun tidak ditemukan"
                });
                return;
            }
            
            const user = result[0];
            const userData = {
                id:user.id,
                fullname:user.fullname,
                email:user.email,
                role:user.role,
                photo:user.photo,
                bio:user.bio
            }

            sendJson(res,200,{
                success:true,
                userData:userData
            })
        });

        return; //untuk memberhentikan ekseusi jika sudah ketemu agar tidak lanjut kode kebawah
    }

    if (req.method === "POST" && url.pathname === "/login") {
        let body ="";

        req.on("data", function(chunk){
            body += chunk;
        });

        req.on("end", function(){
            let data; //deklarasi lokal variabel data
            try{
                data = JSON.parse(body); //mengisi data dari body(url post) ke dalam bentuk JSON
            }catch(err){
                sendJson(res,400,{
                    success:false,
                    message:"Format JSON tidak valid"
                });

                return;
            }

            const email = data.email;
            const password = data.password;

            //validasi untuk field email dan password
            if (!email || !password) {
                sendJson(res,400,{
                    success:false,
                    message:"email dan password harus di isi"
                });

                return;
            }

            conn.query("SELECT * FROM users WHERE email = ?",[email], function(err,result){
                if (err) {
                    sendJson(res,500,{
                        success:false,
                        message:"Server error"
                    });
                    return;
                }

                if (result.length === 0) {
                    console.log("Email tidak ditemukan"); //debug
                    sendJson(res,401,{
                        success:false,
                        message:"Email tidak ditemukan!"
                    });

                    return;
                }

                const user = result[0];
                const userData = {
                    id:user.id,
                    fullname:user.fullname,
                    email:user.email,
                    role:user.role,
                    photo:user.photo,
                    bio:user.bio
                }

                if (password === user.password) {
                    //pembuatan session
                    const sessionId = crypto.randomUUID();

                    session[sessionId] = {
                        id:user.id,
                        fullname:user.fullname,
                        email:user.email,
                        role:user.role,
                        photo:user.photo,
                        bio:user.bio
                    }

                    res.setHeader(
                        "Set-Cookie",
                        `sessionId=${sessionId}; HttpOnly`
                    );

                    res.end(JSON.stringify({
                        success:true,
                        message:"Login Berhasil",
                        user : userData
                    }));
                }else{
                    console.log("Password salah!"); //debug
                    sendJson(res,401,{
                        success:false,
                        message:"Password Salah"
                    })

                    return;
                }
            });
        });

        return;
    }

    if (url.pathname === "/logout") {
        const cookie = req.headers.cookie;
        if (cookie) {
            const sessionId = cookie.split("=")[1];
            delete session[sessionId];
        }else{
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login!"
            });

            return;
        }

        res.setHeader(
            "Set-Cookie",
            "sessionId=; Max-Age=0"
        )

        res.end(JSON.stringify({
            success:true,
            message:"Logout Berhasil"
        }));

        return;
    }

    if (url.pathname === "/profile") {
        const user = getUserSession(req);

        //check user
        if (!user) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                success:false,
                message:"Anda Belum Login!"
            }));
            return;
        }

        res.end(JSON.stringify({
            success:true,
            user:user
        }));
        return;
    }

    res.writeHead(200, { //menulis header dengan status code 200 dan content type text/plain
        'Content-Type' : 'text/plain'
    });
    res.end(JSON.stringify({ //mengakhiri response dengan mengirimkan data dalam format JSON
        success:true,
        message: 'Server Berjalan'
    }))

});

//berfungsi untuk menjalankan server pada hostname dan port yang telah ditentukan
server.listen(port, hostname, function(){
    console.log(`Server berjalan di http://${hostname}:${port}/`); //menampilkan pesan bahwa server berjalan
})