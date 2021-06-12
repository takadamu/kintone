var events = [
  'app.record.detail.show',
  'app.record.edit.submit',
  'app.record.edit.show'
]
kintone.events.on(events, function(event) {
  var record = event.record;
  var client_rank = record['製番']['value'];
  var query = '顧客製番="' + client_rank+'"';
      query = encodeURIComponent(query);
      var appUrl = 'https://itogakki.cybozu.com/k/v1/records.json' +'?app='+ '104' + '&query='+ query;

      // 同期リクエストを行う
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", appUrl, false);
      xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
      xmlHttp.send(null);

      //取得したレコードをArrayに格納
      var resp_data = JSON.parse(xmlHttp.responseText);
      var num = resp_data.records.length;
  record['集計']['value'] = num;
  console.log(resp_data);
  return event;
});