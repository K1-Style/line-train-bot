const channelSecret = process.env.LINE_CHANNEL_SECRET;
var crypto = require("crypto");

/**
 * LINEリクエストシグネチャ認証
 * signature: リクエストヘッダのx-line-signature
 * body: リクエストbody
 * @return チェック結果
 */
exports.validationLineSignature = function (signature, body){
  return signature == crypto.createHmac('sha256', channelSecret).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
}
