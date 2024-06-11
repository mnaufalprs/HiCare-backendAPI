// src/models/calorieModel.js
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

let model;

const loadModel = async () => {
    try {
        const modelPath = path.resolve(__dirname, '/home/naufal/HiCare-backendAPI/model_js/model.json');
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model loaded successfully');
        console.log('Model input shape:', model.inputs[0].shape);
    } catch (error) {
        console.error('Error loading model:', error);
    }
};

const predictCalories = async (encodedInput) => {
    try {
        const tensor = tf.tensor2d(encodedInput);
        const prediction = model.predict(tensor);
        const result = prediction.dataSync();
        return Array.from(result); // Mengembalikan array prediksi
    } catch (error) {
        console.error('Error during prediction:', error);
        throw new Error('Prediction failed');
    }
};

module.exports = { loadModel, predictCalories };
