const mysql = require('mysql2');

// Buat koneksi ke database
const connection = mysql.createConnection({
    host: '192.168.100.208',
    user: 'admin', // sesuaikan dengan username MySQL Anda
    password: 'Admin123', // sesuaikan dengan password MySQL Anda
    database: 'project_capstone' // ganti dengan nama database Anda
});

// Fungsi untuk menambahkan pengguna
const addUser = (user, callback) => {
    const sql = 'INSERT INTO users (username, password, email, age, gender, created_at) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [user.username, user.password, user.email, user.age, user.gender, user.created_at], callback);
};

// Fungsi untuk mencari pengguna berdasarkan username
const findUserByUsername = (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);
    });
};

module.exports = { addUser, findUserByUsername };
