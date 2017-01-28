const assert = require('chai').assert;
const lineAuthUtil = require('../util/line-auth-util.js');
const channelSecret = process.env.LINE_CHANNEL_SECRET;

var crypto = require("crypto");

describe('暗号化確認', function() {
  it('シグネチャチェック正常確認', function() {
    var testBody = 'test';
    var testSignature = crypto.createHmac('sha256', channelSecret).update(new Buffer(JSON.stringify(testBody), 'utf8')).digest('base64');
    assert.isTrue(lineAuthUtil.validationLineSignature(testSignature, testBody), 'シグネチャ正常チェック実施');
  });
  it('シグネチャチェック異常確認', function() {
    var testBody = 'test';
    var testSignature = crypto.createHmac('sha256', channelSecret).update(new Buffer(JSON.stringify('testBody'), 'utf8')).digest('base64');
    assert.isNotTrue(lineAuthUtil.validationLineSignature(testSignature, testBody), 'シグネチャ正常チェック実施');
  });
});
