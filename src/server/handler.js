const bcrypt = require('bcrypt');
const { addUser, findUserByUsername, findUserIdByUsername, addFoodDrinks, addActivity, getActivitiesByUsername, getFoodDrinksByUsername } = require('../service/database');
const { predictCalories } = require('../service/loadModel');
const { foodMapping } = require('../service/foodMapping');
const { predictActivityPoints } = require('../service/loadActivityModel');
const { activityMapping } = require('../service/activityMapping');
const Joi = require('joi');

const postRegisterHandler = async (request, h) => {
    // const { username, email, password, age, gender } = request.payload;
    const { username, email, password } = request.payload;
    const created_at = new Date();

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
        return h.response({ status: 'fail', message: 'Format Email is not valid' }).code(400);
    }

    try {
        // Validasi username unique
        const user = await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

        if (user) {
            return h.response({ status: 'fail', message: 'Username have already, change your username' }).code(409);
        }

        // Validasi password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (!password.match(passwordRegex)) {
            // return h.response({ status: 'fail', message: 'Password harus minimal 6 karakter, mengandung huruf besar, huruf kecil, dan angka' }).code(400);
            return h.response({ status: 'fail', message: 'your password is not valid, Password must be at least 6 characters, contain uppercase, lowercase, and numbers' }).code(400);
        }

        // // Validasi age
        // if (typeof age !== 'number' || age < 0) {
        //     // return h.response({ status: 'fail', message: 'Umur harus berupa angka positif' }).code(400);
        //     return h.response({ status: 'fail', message: 'your age number is not valid' }).code(400);
        // }

        // // Validasi gender
        // const validGenders = ['male', 'female', 'other'];
        // if (!validGenders.includes(gender)) {
        //     return h.response({ status: 'fail', message: 'Gender tidak valid' }).code(400);
        // }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan pengguna baru
        const newUser = { username, password: hashedPassword, email, created_at };
        await new Promise((resolve, reject) => {
            addUser(newUser, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return h.response({
            status: 'success',
            message: 'Registrasi berhasil',
            data: {
                Username: username,
                Email: email,
                // Age: age,
                // Gender: gender,
                createdAt: created_at
            }
        }).code(201);

    } catch (err) {
        console.error(err);
        return h.response({ status: 'fail', message: 'Internal Server Error' }).code(500);
    }
};

const postLoginHandler = async (request, h) => {
    const { username, password } = request.payload;

    try {
        // Cari pengguna berdasarkan username
        const user = await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

        if (!user) {
            return h.response({ status: 'fail', message: 'Username is not already!' }).code(401);
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return h.response({ status: 'fail', message: 'Password incorrect!' }).code(401);
        }

        return h.response({ status: 'success', message: 'Login Successfull' }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({ status: 'fail', message: 'Internal Server Error' }).code(500);
    }
};

const predictModelHandler = async (request, h) => {
    try {
        const { username, food_item } = request.payload;
        const created_at = new Date();
        // Cari ID pengguna berdasarkan username
        const userId = await new Promise((resolve, reject) => {
            findUserIdByUsername(username, (err, id) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(id);
                }
            });
        });

        if (!userId) {
            return h.response({ error: 'User not found' }).code(404);
        }

        const foodInfo = foodMapping[food_item];

        if (!foodInfo) {
            return h.response({ status: 'fail', message: 'Food or Drinks not found!' }).code(404);
        }

        // Membuat input sesuai dengan shape yang diharapkan oleh model
        const encodedInput = [[foodInfo.FoodItemEncoded, foodInfo.kj_per_100_ml_or_gms]];
        const result = await predictCalories(encodedInput);
        const calorie = result[0];

        // Simpan data predict food/drinks
        const newFoodDrinks = { userId, username, food_item, calorie, created_at };
        await new Promise((resolve, reject) => {
            addFoodDrinks(newFoodDrinks, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return h.response({ food_item, calories: result[0] }).code(200);
    } catch (error) {
        console.error('Error in prediction handler:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const inputDataSchema = Joi.object({
    username: Joi.string().required(),
    food_item: Joi.string().required()
});

const predictPointsHandler = async (request, h) => {
    try {
        const { username, activity_item } = request.payload;
        const created_at = new Date();
        // Cari ID pengguna berdasarkan username
        const userId = await new Promise((resolve, reject) => {
            findUserIdByUsername(username, (err, id) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(id);
                }
            });
        });

        if (!userId) {
            return h.response({ error: 'User not found' }).code(404);
        }

        const activityInfo = activityMapping[activity_item];
        if (!activityInfo) {
            return h.response({ status: 'fail', message: 'Activity not found!' }).code(404);
        }

        const encodedInput = [[activityInfo.ActivityItemEncoded, activityInfo.points]];
        const result = await predictActivityPoints(encodedInput);
        const point = result[0];

        // Simpan data predict activity
        const newActivity = { userId, username, activity_item, point, created_at };
        await new Promise((resolve, reject) => {
            addActivity(newActivity, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return h.response({ activity_item, points: result[0] }).code(200);
    } catch (error) {
        console.error('Error in prediction handler:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const activityInputDataSchema = Joi.object({
    username: Joi.string().required(),
    activity_item: Joi.string().required()
});

const GetAllDataHandler = async (request, h) => {
    const { username } = request.query;

    try {
        // Cari ID pengguna berdasarkan username
        const user = await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

        if (!user) {
            return h.response({ status: 'fail', message: 'User not found!' }).code(404);
        }

        // Ambil data dari tabel activities
        const activities = await new Promise((resolve, reject) => {
            getActivitiesByUsername(username, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length ? results : null);
                }
            });
        });

        // Ambil data dari tabel fooddrinks
        const foodDrinks = await new Promise((resolve, reject) => {
            getFoodDrinksByUsername(username, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length ? results : null);
                }
            });
        });

        return h.response({
            status: 'success',
            Username: username,
            data: {
                activities,
                foodDrinks
            }
        }).code(200);

    } catch (err) {
        console.error(err);
        return h.response({ status: 'fail', message: 'Internal Server Error' }).code(500);
    }
};

// const DataInputDataSchema = Joi.object({
//     username: Joi.string().required()
// });

module.exports = {
    postRegisterHandler,
    postLoginHandler,
    predictModelHandler,
    inputDataSchema,
    predictPointsHandler,
    activityInputDataSchema,
    GetAllDataHandler,
    // DataInputDataSchema
};
