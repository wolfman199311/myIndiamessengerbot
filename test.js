const request = require('request');
var timeArray = require('./public/timeslot.json');
// const config = require('./config');
const config = require('./config');


const mongoose = require('mongoose');
const mongodb_url =
    "mongodb+srv://admin:admin@facebookbotcluster0-cqfb6.mongodb.net/Messenger_Bot";
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
const a = 1;
function start(callback) {

    mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, db) => {
        if (a == 0) {

        } else {
            await asyncForEach([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (num) => {
                console.log(num);
            });
            console.log('Done');
            callback();
        }
    });


}




async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

start(() => {
    console.log("finished");
});