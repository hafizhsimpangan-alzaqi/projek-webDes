//https://hostpresto.com/tutorials/using-mysql-with-node-js-a-complete-tutorial/

const mysql = require('mysql2'); //pemanggilan module mysql2 untuk digunakan dalam menghubungkan ke database mysql

//berfungsi konfigurasi koneksi ke database mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'elearn'
});

//berfungsi untuk menghubungkan ke database mysql
connection.connect(function(err){
    //jika terjadi error
    if (err) {
        console.log('Tidak dapat terkoneksi ke database'); //pesan error
        console.log(err); //untuk menampilkan pesan kenapa error
        return; //berfungsi untuk menghetikan program jika error
    }

    console.log('Berhasil Terkoneksi Dengan Database'); //pesan jika berhasil terkoneksi ke database
}); 

module.exports = connection; //berfungsi untuk mengekspor koneksi ke database mysql agar dapat digunakan di file lain