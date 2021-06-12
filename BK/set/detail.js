(function() {
  "use strict";
  kintone.events.on([
    'app.record.detail.show',
    'app.record.edit.show'
  ], function(event){
    // まず、アプリのフィールド設定を取得しておく
    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      // // 関連する案件一覧のレコードを取得する
      // (new RelatedRecordsFieldManager('案件一覧')).getRecords(event.record).then(function(records){
      //   // space1に合計費用の合計値を表示
      //   kintone.app.record.getSpaceElement("space1").innerHTML =
      //     records.reduce(function(sum, record){
      //       return sum + Number(record.合計費用.value);
      //     }, 0).toLocaleString();
      // });
      // 関連する活動履歴のレコードを取得する
      (new RelatedRecordsFieldManager('販売情報')).getRecords(event.record).then(function(records){
        // space2にレコード数を表示
        kintone.app.record.getFieldElement('集計').innerHTML = records.length;
        // kintone.app.record.getSpaceElement("集計").innerHTML = records.length;
      });
    });
  });
})();