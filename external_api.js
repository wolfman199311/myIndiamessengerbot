
const request = require('request');
module.exports = {
    displayShop: function (userId, value, callback){
        console.log(value[0]);
        console.log('___________We received message that display shop list.___________%s,____%d', userId, value);
        apikey = 'AIzaSyBk4KaAJZDJbCjPklCQRjsa-V3rkztv80U';
        console.log(typeof(value));
        var options = {
            'method': 'GET',
            'url': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=store&rankby=distance&=&key='+apikey+'&location=' + value,
            'headers': {
            }
          };
        //   console.log(options);

          request(options, function (error, response) { 
            if (error) throw new Error(error);
            // console.log(response.body);
            var result = JSON.parse(response.body).results;
            // console.log(result);
            console.log(result.length);
            var shopArray = [{addres: value}];
            for (i = 0; i<10; i++){
                // console.log(JSON.stringify(item));
                if (result[i].photos){
                    // console.log(item.photos[0].photo_reference);
                    imageUrl = 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + result[i].photos[0].photo_reference + '&key=' + apikey + '&maxwidth=200'
                } else {
                    // console.log(request.url);
                    imageUrl = ' https://98faba2c.ngrok.io/webhook/public/images/unsupportedimage.png';
                }

                var payload = count + '_' + result[i].name + '_' + value;
                var option = 
                {
                    "title": result[i].name, "image_url": imageUrl,
                    "default_action":
                    {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com/view?item=103", "webview_height_ratio": "tall"
                    },
                    "buttons": '[{ "type": "postback", "title": "Booking schedule time", "payload":' + payload + ' }]'
                };
                shopArray.push(option);
                // console.log(JSON.stringify(shopArray));
                if ( shopArray.length == 10){
                    callback(shopArray);
                }
            }
          });
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
                access_token: 'EAADhs54CZBV4BABhvflRJh3J03zD8zkZBRUtgAFEjm6gruGRyoyX8JZB2bRk8PvzTRTSZBKTZC232llCZBhipVIPPbZCoHgbSZCUgcwqxc1tdvbtOO930vEmCMEHM5JdGnoK7vGBkZBwRijZAAXd43jhG1MFJ4Sko2Sv7Elt9ZAN30SeMHcKsCvXY8M'
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