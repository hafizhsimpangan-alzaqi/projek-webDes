// backend/script.js
//https://nodejs.org/learn/getting-started/introduction-to-nodejs

const { URL } = require('node:url');
const { createServer } = require('node:http'); //pemanggilan fungsi createServer dari module http
const crypto = require("node:crypto");

//import fungsi di file lain
const conn = require('./config/db'); //pemanggilan untuk terkoneksi ke database
const {
    sendJson,
    handleDbError
} = require("./helpers/response");

const {
    sanitizeUser,
    sanitizeCourse,
    sanitizeModule,
    sanitizeMaterial
} = require("./helpers/sanitizer");

const {
    getCookie,
    getUserSession,
    requireTeacher
} = require("./helpers/auth");


//deklarasi hostname dan port
const hostname = '127.0.0.1';
const port = 8080;

//deklarasi session
const session = require("./storage/session");

setInterval(() => {

    const oneDay =
        24 * 60 * 60 * 1000;

    for(const sessionId in session){

        if(
            Date.now()
            - session[sessionId].lastActivity
            > oneDay
        ){
            delete session[sessionId];
        }
    }

},60 * 60 * 1000);


//pembuatan server dengan menggunakan fungsi createServer
const server = createServer((req, res) => {
    //deklarasi URL
    const url = new URL(req.url, `http://${req.headers.host}`);


    if (req.method === "GET" &&url.pathname === "/user") {
        const authUser = getUserSession(req);
        let id = url.searchParams.get("id");

        if (!authUser) {
            sendJson(res,401,{
                success:false,
                message:"Anda Harus Login Terlebih Dahulu!"
            });
            return;
        }

        if (!id) {
            sendJson(res,400,{
                success:false,
                message:"Parameter harus disi"
            });
            return;
        }

        conn.query("SELECT * FROM users WHERE id = ?", [id], function(err,result){
            if(err){
                handleDbError(res,err);
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
            const userData = sanitizeUser(user);

            sendJson(res,200,{
                success:true,
                user:userData
            });
            return;
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
            if(err){
                handleDbError(res,err);
                return;
            }

                if (result.length === 0) {
                    console.log("Email tidak ditemukan"); //debug
                    sendJson(res,401,{
                        success:false,
                        message:"Email dan password salah"
                    });

                    return;
                }

                const user = result[0];
                const userData = sanitizeUser(user);

                if (password === user.password) {
                    //pembuatan session
                    const sessionId = crypto.randomUUID();

                    session[sessionId] = {
                        user:sanitizeUser(user),
                        lastActivity:Date.now()
                    };

                    res.setHeader(
                        "Set-Cookie",
                        `sessionId=${sessionId}; HttpOnly; Path=/`
                    );

                    sendJson(res,200,{
                        success:true,
                        message:"Login Berhasil",
                        user:userData
                    });
                    return;
                }else{
                    console.log("Password salah!"); //debug
                    sendJson(res,401,{
                        success:false,
                        message:"Email dan password Salah"
                    });
                    return;
                }
            });
        });

        return;
    }

    if (req.method === "POST" && url.pathname === "/logout") {
        const sessionId = getCookie(req,"sessionId");

        if (!sessionId) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login!"
            });
            return;
        }

        if (!session[sessionId]) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login"
            });
            return;
        }

        delete session[sessionId];

        res.setHeader(
            "Set-Cookie",
            "sessionId=; Max-Age=0; HttpOnly; Path=/"
        );

        sendJson(res,200,{
            success:true,
            message:"Logout Berhasil"
        });

        return;
    }

    if (req.method === "GET" && url.pathname === "/profile") {
        const user = getUserSession(req);

        //check user
        if (!user) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login!"
            });
            return;
        }

        sendJson(res,200,{
            success:true,
            user:user
        });
        return;
    }

    if (req.method === "GET" && url.pathname === "/courses") {
        const authUser = getUserSession(req);

        if (!authUser) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login"
            });
            return;
        }

        conn.query(
            `
            SELECT
            c.id,
            c.teacher_id,
            c.title,
            c.description,
            c.thumbnail,
            u.fullname AS teacher_name
            FROM courses c
            JOIN users u
            ON c.teacher_id=u.id
            `,
            function(err,result)
            {
            if(err){
                handleDbError(res,err);
                return;
            }

            const courses = result.map(
                course => sanitizeCourse(course)
            );

            sendJson(res,200,{
                success:true,
                courses:courses
            });
            return;
        });

        return;
    }

    if (req.method === "GET" && url.pathname === "/course") {
        const authUser = getUserSession(req);
        const id = url.searchParams.get("id");

        if (!authUser) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login"
            });
            return;
        }

        if (!id) {
            sendJson(res,400,{
                success:false,
                message:"Parameter id Harus Diisi"
            });
            return;
        }

        conn.query(
        "SELECT c.id,c.teacher_id,c.title,c.description,c.thumbnail,u.fullname AS teacher_name FROM courses c JOIN users u ON c.teacher_id=u.id WHERE c.id=?",
        [id], 
        function(err,result)
        {
            if(err){
                handleDbError(res,err);
                return;
            }

            if (result.length === 0) {
                sendJson(res,404,{
                    success:false,
                    message:"Course Tidak Ditemukan"
                })
                return;
            }

            const course = sanitizeCourse(result[0]);
            
            sendJson(res,200,{
                success:true,
                course:course
            });
            return;
        });
        return;
    }

    if (req.method === "GET" && url.pathname === "/modules") {

        const authUser = getUserSession(req);
        const courseId = url.searchParams.get("course_id");

        if (!authUser) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login"
            });
            return;
        }

        if (!courseId) {
            sendJson(res,400,{
                success:false,
                message:"Parameter course_id harus diisi"
            });
            return;
        }

        conn.query(
            "SELECT * FROM modules WHERE course_id = ? ORDER BY order_no ASC",
            [courseId],
            function(err,result){

                if(err){
                    handleDbError(res,err);
                    return;
                }

                const modules = [];

                for(let module of result){
                    modules.push(
                        sanitizeModule(module)
                    );
                }

                sendJson(res,200,{
                    success:true,
                    modules:modules
                });
                return;
            }
        );

        return;
    }

    if (req.method === "GET" && url.pathname === "/materials") {

        const authUser = getUserSession(req);
        const moduleId = url.searchParams.get("module_id");

        if (!authUser) {
            sendJson(res,401,{
                success:false,
                message:"Anda Belum Login"
            });
            return;
        }

        if (!moduleId) {
            sendJson(res,400,{
                success:false,
                message:"Parameter module_id harus diisi"
            });
            return;
        }

        conn.query(
            "SELECT * FROM materials WHERE module_id=?",
            [moduleId],
            function(err,result){

                if(err){
                    handleDbError(res,err);
                    return;
                }

                const materials = result.map(
                    material => sanitizeMaterial(material)
                );

                sendJson(res,200,{
                    success:true,
                    materials:materials
                });
                return;
            }
        );

        return;
    }

    if(req.method === "POST" && url.pathname === "/course/create"){

        const teacher = requireTeacher(req);

        if(teacher === null){
            sendJson(res,401,{
                success:false,
                message:"Anda harus login"
            });
            return;
        }

        if(teacher === false){
            sendJson(res,403,{
                success:false,
                message:"Akses ditolak"
            });
            return;
        }

        let body = "";

        req.on("data",chunk=>{
            body += chunk;
        });

        req.on("end",()=>{

            let data;

            try{
                data = JSON.parse(body);
            }catch{
                sendJson(res,400,{
                    success:false,
                    message:"Format JSON tidak valid"
                });
                return;
            }

            const title = data.title;
            const description = data.description;

            if(!title){
                sendJson(res,400,{
                    success:false,
                    message:"Title harus diisi"
                });
                return;
            }

            conn.query(
                `INSERT INTO courses
                (teacher_id,title,description)
                VALUES(?,?,?)`,
                [
                    teacher.id,
                    title,
                    description
                ],
                function(err,result){

                    if(err){
                        handleDbError(res,err);
                        return;
                    }

                    sendJson(res,201,{
                        success:true,
                        message:"Course berhasil dibuat",
                        course_id:result.insertId
                    });
                    return;
                }
            );
        });

        return;
    }

    if(req.method === "POST" && url.pathname === "/module/create"){

        const teacher = requireTeacher(req);

        if(teacher === null){
            sendJson(res,401,{
                success:false,
                message:"Anda harus login"
            });
            return;
        }

        if(teacher === false){
            sendJson(res,403,{
                success:false,
                message:"Akses ditolak"
            });
            return;
        }

        let body = "";

        req.on("data",chunk=>{
            body += chunk;
        });

        req.on("end",()=>{

            let data;

            try{
                data = JSON.parse(body);
            }catch{
                sendJson(res,400,{
                    success:false,
                    message:"Format JSON tidak valid"
                });
                return;
            }

            const courseId = data.course_id;
            const title = data.title;
            const description = data.description;
            const orderNo = data.order_no;

            if(!courseId || !title || orderNo == null){
                sendJson(res,400,{
                    success:false,
                    message:"Data tidak lengkap"
                });
                return;
            }

            conn.query(
                `SELECT id
                FROM courses
                WHERE id = ?
                AND teacher_id = ?`,
                [
                    courseId,
                    teacher.id
                ],
                function(err,result){

                    if(err){
                        handleDbError(res,err);
                        return;
                    }

                    if(result.length === 0){
                        sendJson(res,403,{
                            success:false,
                            message:"Course tidak ditemukan atau bukan milik anda"
                        });
                        return;
                    }

                    conn.query(
                        `INSERT INTO modules
                        (course_id,title,description,order_no)
                        VALUES(?,?,?,?)`,
                        [
                            courseId,
                            title,
                            description,
                            orderNo
                        ],
                        function(err,result){

                            if(err){
                                handleDbError(res,err);
                                return;
                            }

                            sendJson(res,201,{
                                success:true,
                                message:"Module berhasil dibuat",
                                module_id:result.insertId
                            });
                            return;
                        }
                    );
                }
            );
        });

        return;
    }
    
    if(req.method === "POST" && url.pathname === "/material/create"){

        const teacher = requireTeacher(req);

        if(teacher === null){
            sendJson(res,401,{
                success:false,
                message:"Anda harus login"
            });
            return;
        }

        if(teacher === false){
            sendJson(res,403,{
                success:false,
                message:"Akses ditolak"
            });
            return;
        }

        let body = "";

        req.on("data",chunk=>{
            body += chunk;
        });

        req.on("end",()=>{

            let data;

            try{
                data = JSON.parse(body);
            }catch{
                sendJson(res,400,{
                    success:false,
                    message:"Format JSON tidak valid"
                });
                return;
            }

            const moduleId = data.module_id;
            const title = data.title;
            const type = data.type;

            const allowTypes = [
                "TEXT",
                "VIDEO",
                "FILE"
            ]

            if (!type || !allowTypes.includes(type)) {
                sendJson(res,400,{
                    success:false,
                    message:"Tipe Materi Tidak Valid!"
                });
                return;
            }

            const content = data.content;
            const filePath = data.file_path;

            if(!moduleId || !title || !type){
                sendJson(res,400,{
                    success:false,
                    message:"Data tidak lengkap"
                });
                return;
            }

            conn.query(
                `SELECT m.id
                FROM modules m
                JOIN courses c
                ON m.course_id = c.id
                WHERE m.id = ?
                AND c.teacher_id = ?`,
                [
                    moduleId,
                    teacher.id
                ],
                function(err,result){

                    if(err){
                        handleDbError(res,err);
                        return;
                    }

                    if(result.length === 0){
                        sendJson(res,403,{
                            success:false,
                            message:"Module tidak ditemukan atau bukan milik anda"
                        });
                        return;
                    }

                    conn.query(
                        `INSERT INTO materials
                        (module_id,title,type,content,file_path)
                        VALUES(?,?,?,?,?)`,
                        [
                            moduleId,
                            title,
                            type,
                            content,
                            filePath
                        ],
                        function(err,result){

                            if(err){
                                handleDbError(res,err);
                                return;
                            }

                            sendJson(res,201,{
                                success:true,
                                message:"Material berhasil dibuat",
                                material_id:result.insertId
                            });
                            return;
                        }
                    );
                }
            );

        });

        return;
    }

    sendJson(res,404,{
        success:false,
        message:"Tujuan Tidak Ditemukan"
    })
    return;
});

//berfungsi untuk menjalankan server pada hostname dan port yang telah ditentukan
server.listen(port, hostname, function(){
    console.log(`Server berjalan di http://${hostname}:${port}/`); //menampilkan pesan bahwa server berjalan
})