'use strict';
const request = require('request');
var timeArray = require('./public/timeslot.json');
// const config = require('./config');
const config = require('./config');


const mongoose = require('mongoose');
const mongodb_url =
    "mongodb+srv://admin:admin@facebookbotcluster0-cqfb6.mongodb.net/Messenger_Bot";
// 


module.exports = {

    addUser: function (callback, userId) {
        request({
            uri: 'https://graph.facebook.com/v3.2/' + userId,
            qs: {
                access_token: config.FB_PAGE_TOKEN
            }

        },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var user = JSON.parse(body);

                    if (user.first_name != "undefined") {
                        console.log("success save user");
                        mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("completed data successfully.");
                                var dbo = db.db;
                                var findUser = { fb_id: userId };
                                dbo.collection("users").find(findUser).toArray(function (err, result) {
                                    if (err) throw err;
                                    console.log(result.length);
                                    if (!result.length) {
                                        var insertUser = { fb_id: userId, firstname: user.first_name, lastname: user.last_name, profile_picture: user.profile_pic };
                                        dbo.collection("users").insertOne(insertUser, function (err, res) {
                                            if (err) throw err;
                                            console.log("1 document inserted");
                                            callback();
                                            db.close();
                                        });
                                    }
                                });

                             
                            }
                        });


                    } else {
                        console.log("Cannot get data for fb user with id",
                            userId);
                    }
                } else {
                    console.error(response.error);
                }

            });
    },
   
    add_Shoplist: function (userId, array, callback) {
        console.log(array, userId);
        mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
            if (err) {
                console.log(err);
            } else {
                console.log("addshoplist");
                // var myquery = { fb_id: userId };
                // var addshoplistquery = { $set: { fb_id: userId, shoplist: array } };
                // var dbo = db.db;
                // dbo.collection("users").updateOne(myquery, addshoplistquery, function (err, res) {
                //     if (err) throw err;
                //     console.log("1 document updated");
                //     db.close();
                //     callback(userId);
                // });

            }
        });

    },

    add_Timeslot: function ( shopName, place_id, callback) {
        mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
            if (err) {
                console.log(err);
            } else {
                var dbo = db.db;
                var findShop = { place_id: place_id };
                dbo.collection("shopList_collection").find(findShop).toArray(function (err, result) {
                    if (err) throw err;
                    console.log(result.length);
                    if (!result.length) {
                        console.log(timeArray.timeslot);
                        var insertShop = { place_id: place_id, shopName: shopName ,timeSlot: timeArray.timeslot};
                        dbo.collection("shopList_collection").insertOne(insertShop, function (err, res) {
                            if (err) throw err;
                            console.log("1 shop document inserted");
                            callback(timeArray.timeslot)
                            db.close();
                        });
                    } else {

                    }
                });
            }
        });
    }

}
