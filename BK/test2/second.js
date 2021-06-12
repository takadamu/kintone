(function() {
  "use strict";

  window.addEventListener("load", function(loadedEvent) {

  kintone.events.on([
    'app.record.detail.show',
    'app.record.edit.show'
  ], function(event){
    window.alert('レコード追加イベントが呼び出されました');
    // まず、アプリのフィールド設定を取得しておく
    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      // 関連する案件一覧のレコードを取得する
      // (new RelatedRecordsFieldManager('販売情報')).getRecords(event.record).then(function(records){
        // space1に合計費用の合計値を表示
      //   kintone.app.record.getSpaceElement("space1").innerHTML =
      //     records.reduce(function(sum, record){
      //       return sum + Number(record.合計費用.value);
      //     }, 0).toLocaleString();
      // });
      // 関連する活動履歴のレコードを取得する
      // (new RelatedRecordsFieldManager('販売情報')).getRecords(event.record).then(function(records){
      //   // space2にレコード数を表示
      //   kintone.app.record['集計'] = records.value;



      const appId = kintone.app.getRelatedRecordsTargetAppId('販売情報');
      const query = '顧客製番="' + event.record['製番'].value + '"';
      const paramGET = {
        'app' : appId,
        'query' : query,
        'totalCount' : true
      };
      kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGET, (resp)=> {
        event.record['集計'].value = resp.totalCount;
        kintone.app.record.set(event);
      });
      return event;
      
      });
    });
  });
})();