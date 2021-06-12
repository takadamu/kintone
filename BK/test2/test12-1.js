(function() {
  // 正しいコーディングのみを許可するモード
  "use strict";
  // イベントハンドラー(イベントが発生したときに呼び出される処理)を登録する
  kintone.events.on([
    // 一覧を表示したとき
    'app.record.index.show'
    // イベント発生時に実行されるハンドラー
  ], function(event){

    const appId = kintone.app.getRelatedRecordsTargetAppId('販売情報');
    const query = '顧客製番="' + event.record['製番'].value + '"';
    const paramGET = {
      'app' : appId,
      'query' : query,
      'totalCount' : true
    };

    kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', paramGET, function(resp) {

      kintone.app.record.getFieldElement('集計').innerText = resp.totalCount; //表示する値の書き換え
      });


    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      // キャメルケース(ローワーキャメルケース)
      // キャメルケースとは最初の単語はすべて小文字として、 2 つ目以降の単語は先頭の文字を大文字にしてそれ以外は小文字で記述する方法です
      // var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
      var aggregateRecordsField = new RelatedRecordsFieldManager('集計');
      event.records.forEach(function(record, index){
        aggregateRecordsField.getRecords(record).then(function(records){
          if(records.value) {
            // console.log(records);

            kintone.app.getFieldElements('集計')[index].innerText = records.value;
          }
        });
      });


    });
  });
  var RelatedRecordsFieldManager = (function(fieldCode){
    function RelatedRecordsFieldManager(fieldCode) {
      this.fieldCode = fieldCode;
      this.targetAppId = kintone.app.getRelatedRecordsTargetAppId(fieldCode);
      this.property = this.fieldProperties[fieldCode].referenceTable;
    }
    RelatedRecordsFieldManager.prototype = {
      selfAppId: kintone.app.getId(),
      records: [],
      limit: 1,
      //limit: 500,
      offset: 0,
      getFieldProperties: function(){
        // kintone REST APIの概要 → kintone アプリのレコードの操作やフォーム設計情報の取得、スペースを操作
        return kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', {
          app: RelatedRecordsFieldManager.prototype.selfAppId,
        }).then(function(response){
          RelatedRecordsFieldManager.prototype.fieldProperties = response.properties;
        });
      },
      query: function(record){
        return (
          this.property.condition.relatedField +
          '="' +
          record[this.property.condition.field].value +
          (this.property.filterCond ? '" and ' : '"') +
          this.property.filterCond
        );
      },
      getRecords: function(record){
        // thisにthisへの参照を保持させる
        var _this = this;
        return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
          app: this.targetAppId,
          query:
            this.query(record) +
            ' order by ' + this.property.sort +
            ' limit ' + this.limit +
            ' offset ' + this.offset
        }).then(function(response){
          return response.records;
          /*_this.records = _this.records.concat(response.records);
          _this.offset += response.records.length;
          if(response.records.length === _this.limit){
            return _this.getRecords(record);
          }else{
            return _this.records;
          }*/
        });
      }
    }
    return RelatedRecordsFieldManager;
  })();
})();