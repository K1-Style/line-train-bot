const assert = require('chai').assert;
const trainUtil = require('../util/train-util.js');

describe('鉄道遅延情報Jsonの結果取得確認', function() {
  it('配列確認', function() {
    return trainUtil.getTrainJson().then(function (json) {
      assert.isArray(json, '結果が配列で返ってくることの確認');
    });
  });
  it('プロパティ確認', function() {
    return trainUtil.getTrainJson().then(function (json) {
      var jsonRecord;
      json.some(function(data) {
        jsonRecord = data;
        return true;
      });
      assert.property(jsonRecord, 'name');
      assert.property(jsonRecord, 'company');
      assert.property(jsonRecord, 'lastupdate_gmt');
      assert.property(jsonRecord, 'source');
    });
  });
});
describe('出力メッセージ確認', function() {
  it('発言と合致した結果がない場合（発言した線に遅延が無い場合）', function() {
    return trainUtil.getTrainJson().then(function (json) {
      var differenceName = makeRandomText(3); //ランダムの3文字を作る
      json.forEach(function(data) {
        differenceName = makeDifferenceText(differenceName, data.name, 3);
      });
      var searchText = trainUtil.searchTrainInfo(differenceName, json);
      assert.equal(searchText, '「' + differenceName + '」遅延情報はございません');
    });
  });
  it('発言と合致した結果がある場合（発言した路線に遅延がある場合）', function() {
    return trainUtil.getTrainJson().then(function (json) {
      var jsonRecord;
      json.some(function(data) {
        jsonRecord = data;
        return true;
      });
      var searchText = trainUtil.searchTrainInfo(jsonRecord.name, json);
      assert.include(searchText, '以下の遅延情報がございます。\n', searchText);
      assert.include(searchText, '\n・' + jsonRecord.name + '(' + jsonRecord.company + ')', searchText);
    });
  });
  it('発言と合致した結果がある場合（発言した会社名に遅延がある場合）', function() {
    return trainUtil.getTrainJson().then(function (json) {
      var jsonRecord;
      json.some(function(data) {
        jsonRecord = data;
        return true;
      });
      var searchText = trainUtil.searchTrainInfo(jsonRecord.company, json);
      assert.include(searchText, '以下の遅延情報がございます。\n', searchText);
      assert.include(searchText, '\n・' + jsonRecord.name + '(' + jsonRecord.company + ')', searchText);
    });
  });
});

/**
 * 指定した文字列と違う文字列を作る
 * @return 文字列
 */
function makeDifferenceText(differenceName, name, length){
  if(differenceName == name){
    differenceName = makeDifferenceText(makeRandomText(length), name, length);
  }
  return differenceName;
}

/**
 * ランダム文字列を作る
 * @return 文字列
 */
function makeRandomText(length){
  return Math.random().toString(36).slice(length * -1);
}
