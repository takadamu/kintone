(function() {
  "use strict";
  kintone.events.on([
    'app.record.index.show'
  ], function(event){
      RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
      var elStatus = kintone.app.getFieldElements('製番');

      for (var i = 0; i < elStatus.length; i++) {
          var record = event.records[i];
      //     // elStatus[i].style.backgroundColor = bgColor;

        if (record['製番'] != null) {
          kintone.app.getFieldElements('製番')[index].style.display = none;
        }
      }
    });
  });
});
