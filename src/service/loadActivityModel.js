const tf = require('@tensorflow/tfjs-node');
const path = require('path');

let activityModel;

const loadActivityModel = async () => {
    try {
        const modelPath = path.resolve(__dirname, '/home/naufal/HiCare-backendAPI/model2_js/model.json');
        activityModel = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Activity model loaded successfully');
        console.log('Model input shape:', activityModel.inputs[0].shape);
    } catch (error) {
        console.error('Error loading activity model:', error);
    }
};

const predictActivityPoints = async (encodedInput) => {
    try {
        const tensor = tf.tensor2d(encodedInput);
        const prediction = activityModel.predict(tensor);
        const result = prediction.dataSync();
        return Array.from(result);
    } catch (error) {
        console.error('Error during prediction:', error);
        throw new Error('Prediction failed');
    }
};

module.exports = { loadActivityModel, predictActivityPoints };
