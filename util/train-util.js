const request = require('superagent');
const endpoint = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';

var json;

/**
 * 電車遅延情報検索
 * searchText: LINEから発言された文字列
 * result: 電車遅延結果情報（JSON）
 * @return LINEで返す文字列
 */
exports.searchTrainInfo = function (searchText, result){
  // 返す文字
  var returnText = '「' + searchText + '」遅延情報はございません';
  var returnDelayTrain = '';

  //遅延情報を１つずつチェック
  result.forEach(function(data) {

    var rg = new RegExp('.*('+searchText+').*');

    //会社名または路線名に合致した場合、通知する
    if (rg.test(data.company) || rg.test(data.name)) {
      returnDelayTrain += '\n・' + data.name + '(' + data.company + ')';
    }
  });
  if(returnDelayTrain != ''){
    // 遅延情報がある場合は以下の文言で返信する
    returnText = '以下の遅延情報がございます。' + returnDelayTrain;
  }

  return returnText;
}

/**
 * 電車遅延情報取得
 */
exports.getTrainJson = function (){
  return requestAsync(endpoint).then(onFulfilled, onRejected);
}

function requestAsync(url) {
  return new Promise(function(resolve, reject){
    request.get(url)
          .end(function(error, response){
            if(error || !response.ok){
              reject(error); // errがあればrejectを呼び出す
              return;
            }
            resolve(response.body); // errがなければ成功とみなしresolveを呼び出す
          });
 });
}

// 成功時呼ばれる関数
function onFulfilled(data) {
  return Promise.resolve(data);
}

function onRejected(err) {
  throw error;
}
