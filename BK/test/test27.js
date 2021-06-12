(function() {
  "use strict";
  
  //レコードの編集、詳細画面で適用する
  var events = [
  'app.record.detail.submit',
  'app.record.edit.submit',
  'app.record.index.edit.submit'
   ]
  kintone.events.on(events, function(event) {
  var record = event.record;
  var client_rid = event.recordId;
  var related = kintone.app.getRelatedRecordsTargetAppId('関連レコード一覧');
  var offset = 0;
  var loop_end_flg = false;
  var records = new Array();
  while(!loop_end_flg){
  
  var query = '会場名_開催日 ="' + record['会場名_開催日'].value +
  '" and 申込結果 in ("OK")' +
  ' limit 100 offset ' + offset;
  query = encodeURIComponent(query);
  var appUrl = kintone.api.url('/k/guest/35/v1/records') + '?app='+ related + '&query=' + query;
  
  // 同期リクエストを行う
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", appUrl, false);
  xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
  xmlHttp.send(null);
  
  //取得したレコードをArrayに格納
  var resp_data = JSON.parse(xmlHttp.responseText);
  
  if(resp_data.records.length > 0){
  for(var i = 0; resp_data.records.length > i; i++){
  records.push(resp_data.records[i]);
  }
  offset += resp_data.records.length;
  }else{
  loop_end_flg = true;
  }
  }
  
  var amount = records.length;
  
  record.加盟社数.value = amount;
  
  return event;
  
  });
})();