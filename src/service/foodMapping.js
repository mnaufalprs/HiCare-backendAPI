const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const LabelEncoder = require('./labelEncoder');  // Import custom LabelEncoder

const foodMapping = {};
const labelEncoder = new LabelEncoder();

const loadFoodMapping = () => {
    return new Promise((resolve, reject) => {
        const foodNames = [];
        const foodData = [];

        fs.createReadStream(path.resolve(__dirname, '../public/food_features.csv'))
            .pipe(csv())
            .on('data', (row) => {
                const { food_name, kj_per_100_ml_or_gms, cal_per_100_ml_or_gms } = row;
                foodNames.push(food_name);
                foodData.push({
                    food_name,
                    kj_per_100_ml_or_gms: parseFloat(kj_per_100_ml_or_gms),
                    cal_per_100_ml_or_gms: parseFloat(cal_per_100_ml_or_gms)
                });
            })
            .on('end', () => {
                labelEncoder.fit(foodNames);  // Fit the label encoder with the food names
                foodData.forEach((item) => {
                    const encodedFoodName = labelEncoder.transform([item.food_name])[0];
                    foodMapping[item.food_name] = {
                        kj_per_100_ml_or_gms: item.kj_per_100_ml_or_gms,
                        cal_per_100_ml_or_gms: item.cal_per_100_ml_or_gms,
                        FoodItemEncoded: encodedFoodName
                    };
                });
                resolve(foodMapping);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = { loadFoodMapping, foodMapping };
