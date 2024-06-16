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

// Fungsi untuk menambahkan data hasil predict makanan
const addFoodDrinks = (item, callback) => {
    const sql = 'INSERT INTO fooddrinks ( user_id, username, name, calories, created_at) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [item.userId, item.username, item.food_item, item.calorie, item.created_at], callback);
};

// Fungsi untuk menambahkan data hasil predict activity
const addActivity = (item, callback) => {
    const sql = 'INSERT INTO activities ( user_id, username, nameActivity, points, created_at) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [item.userId, item.username, item.activity_item, item.point, item.created_at], callback);
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

const findUserIdByUsername = (username, callback) => {
    const sql = 'SELECT user_id FROM users WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]?.user_id);
    });
};

module.exports = { addUser, findUserByUsername, findUserIdByUsername, addFoodDrinks, addActivity };

