process.env.TZ = 'Asia/Tokyo';

const request = require('superagent');
const trainUtil = require('./util/train-util.js');

const lineAuthUtil = require('./util/line-auth-util.js');

const endpoint = 'https://api.line.me/v2/bot/message/reply';
const accessToken = process.env.LINE_ACCESS_TOKEN;

module.exports.webhook = (event, context, callback) => {
  //シグネチャチェック
  if (! lineAuthUtil.validationLineSignature(event.headers['X-Line-Signature'], event.body)) {
    callback(new Error('[400] Bad Request'));
  }

  // 返信メッセージ作成
  var body = JSON.parse(event.body);
  body.events.forEach(function(data) {
    var replyToken = data.replyToken;
    var message = data.message.text;

    trainUtil.getTrainJson().then(function (json) {
      var searchText = trainUtil.searchTrainInfo(message, json);
      console.log(searchText);
      request.post(endpoint)
              .set('Content-type', 'application/json; charset=UTF-8')
              .set('Authorization',  'Bearer ' + accessToken)
              .send({
                replyToken: replyToken,
                messages: [
                  {
                    type: 'text',
                    text: searchText,
                  },
                ],
              }).end(function(error){
              if (error) {
                console.log(error);
              }
            });
    });
  });
  callback(null, {statusCode: 200, body: JSON.stringify({})});
};
