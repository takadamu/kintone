(function() {
  "use strict";
  kintone.events.on(['app.record.detail.show','app.record.create.submit','app.record.edit.submit'], function(event){
    return new kintone.Promise(function(resolve){
      RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
        (new RelatedRecordsFieldManager('販売情報')).getRecords(event.record).then(function(records){
       //RelatedRecordsFieldManager('関連レコード一覧4'))の'関連レコード一覧4'を'案件一覧'へ変更
        //合計数値の合計値☆
          event.record.total.value = records.reduce(function(sum, record){
          //sale4をtotalに変更
            return sum + Number(record.集計.value);
            //(record.sale.value)を、(record.合計費用.value)に変更
            }, 0);
       resolve(event);
      });
     });
    });
  });
  // コンストラクタ定義（参照URLのコードをそのままコピペしてます）
  var RelatedRecordsFieldManager = (function(fieldCode){
  function RelatedRecordsFieldManager(fieldCode) {
  this.fieldCode = fieldCode;
  this.targetAppId = kintone.app.getRelatedRecordsTargetAppId(fieldCode);
  this.property = this.fieldProperties[fieldCode].referenceTable;
  }
  RelatedRecordsFieldManager.prototype = {
  selfAppId: kintone.app.getId(),
  records: [],
  limit: 500,
  offset: 0,
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
  ' offset ' + this.offset
  }).then(function(response){
  _this.records = _this.records.concat(response.records);
  _this.offset += response.records.length;
  if(response.records.length === _this.limit){
  return _this.getRecords(record);
  }else{
  return _this.records;
  }
  });
  }
  }
  return RelatedRecordsFieldManager;
  })();
  //コンストラクタ定義ここまで
  });
  
  