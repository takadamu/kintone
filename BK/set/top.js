(function() {
    "use strict";
    kintone.events.on([
      'app.record.index.show'
    ], function(event){
      // まず、アプリのフィールド設定を取得しておく
      RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){

        var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
        event.records.forEach(function(record, index){
          relatedRecordsField.getRecords(record).then(function(records){

             kintone.app.record.getFieldElement('製番')[index].innerHTML = records.length;

        });
      });
    });
  });
});