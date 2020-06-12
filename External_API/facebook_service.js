
const request = require('request');
const config = require('../config');

module.exports = {

    sendTextMessage: function (recipientId, text) {
        let self = module.exports;
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: text
            }
        }
        self.callSendAPI(messageData);
    },

    sendQuickReply: function (recipientId, text, replies, metadata) {
        let self = module.exports;
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: text,
                metadata: self.isDefined(metadata) ? metadata : '',
                quick_replies: replies
            }
        };

        self.callSendAPI(messageData);
    },

    callSendAPI: function (messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: config.FB_PAGE_TOKEN
            },
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                if (messageId) {
                    console.log("Successfully sent message with id %s to recipient %s",
                        messageId, recipientId);
                } else {
                    console.log("Successfully called Send API for recipient %s",
                        recipientId);
                }
            } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
            }
        });
    },

    showStore: function (userID, array, callback) {

        var _array = [];
        array.forEach(item => {
            const obj = {
                "title": item.title,
                "image_url": item.image_url,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": item.buttons[0].url + '&userID=' + userID,
                        "title": "Booking schedule time",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": "true"
                    }
                ]
            };
            _array.push(obj);
        });

        var options = {
            'method': 'POST',
            'url': 'https://graph.facebook.com/v7.0/me/messages?access_token=' + config.FB_PAGE_TOKEN,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "recipient": {
                    "id": userID
                },
                "message":
                {
                    "attachment":
                    {
                        "type": "template",
                        "payload":
                        {
                            "template_type": "generic",
                            "elements": _array
                        }
                    }
                }
            })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            callback(true);
        });
    },

    isDefined: function (obj) {
        if (typeof obj == 'undefined') {
            return false;
        }

        if (!obj) {
            return false;
        }

        return obj != null;
    }
}