const conn = require('./db');

const email = "admin@mail.com"
const passwd = "123456"
const queryOne = "select * from users where email = ?";
conn.query(queryOne,[email], function(err,result){
    if(err){
        console.log(err);
        return;
    }

    if(result.length === 0){
        console.log("Email tidak ditemukan");
        return;
    }

    const user = result[0];

    if(passwd === user.password){
        console.log("Login Berhasil");
    }else{
        console.log("Password Salah");
        return;
    }
    conn.end();
})

