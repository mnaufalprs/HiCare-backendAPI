const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const LabelEncoder = require('./labelEncoder');

const activityMapping = {};
const labelEncoder = new LabelEncoder();

const loadActivityMapping = () => {
    return new Promise((resolve, reject) => {
        const activityNames = [];
        const activityData = [];

        fs.createReadStream(path.resolve(__dirname, '../public/activities.csv'))
            .pipe(csv())
            .on('data', (row) => {
                const { activity_name, other_feature, points } = row;
                activityNames.push(activity_name);
                activityData.push({
                    activity_name,
                    other_feature: parseFloat(other_feature),
                    points: parseFloat(points)
                });
            })
            .on('end', () => {
                labelEncoder.fit(activityNames);
                activityData.forEach((item) => {
                    const encodedActivityName = labelEncoder.transform([item.activity_name])[0];
                    activityMapping[item.activity_name] = {
                        other_feature: item.other_feature,
                        points: item.points,
                        ActivityItemEncoded: encodedActivityName
                    };
                });
                resolve(activityMapping);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = { loadActivityMapping, activityMapping };
