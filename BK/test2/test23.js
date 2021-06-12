(function() {
  "use strict";
  kintone.events.on([
    // 'app.record.index.show'
    'app.record.detail.show'
    // ,
    // 'app.record.edit.show'
  ], function(event){
    // まず、アプリのフィールド設定を取得しておく
    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      // 関連する販売情報のレコードを取得する
      (new RelatedRecordsFieldManager('販売情報')).getRecords(event.record).then(function(records){
        // space2にレコード数を表示
        // kintone.app.record.getFieldElement('num').innerHTML = records.length;



        kintone.app.record.getFieldElement('num').innerHTML = records.length;


        var record = kintone.app.record.get();
        var agg = kintone.app.record.getSpaceElement('num');
        // フィールドの値の書き換え
        event.record['集計'].value = agg;
        // // フィールドの編集可/不可の設定
        // record.record['フィールドコード'].disabled = true;
        // // フィールドのエラーの指定
        // record.record['フィールドコード'].error = 'エラー';
        // // ルックアップの自動取得
        // record.record['集計'].value = '76'; // ルックアップフィールドの値


      });
    });
  });
})();

window.RelatedRecordsFieldManager = (function(fieldCode){
  var RelatedRecordsFieldManager = function(fieldCode){
    this.fieldCode = fieldCode;
    this.property = this.fieldProperties[fieldCode].referenceTable;
    this.targetAppId = this.property.relatedApp.app;
  }
  RelatedRecordsFieldManager.prototype = {
    selfAppId: kintone.app.getId(),
    records: [],
    limit: 500,
    getFieldProperties: function(){
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
      var _this = this;
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
        app: this.targetAppId,
        query:
          this.query(record) +
          ' order by ' + this.property.sort +
          ' limit ' + this.limit +
          ' offset ' + this.records.length
      }).then(function(response){
        _this.records = _this.records.concat(response.records);
        return response.records.length === _this.limit ? _this.getRecords(record) : _this.records;
      });
    }
  }
  return RelatedRecordsFieldManager;
})();