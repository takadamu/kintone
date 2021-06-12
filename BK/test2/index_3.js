(function() {
  "use strict";
  kintone.events.on( "app.record.index.show", function(event) {
      var records = event.records;

      for(var i = 0; i < record.length; i++) {
          var nouki = record[i].納期.value;

          const appId = kintone.app.getRelatedRecordsTargetAppId('販売情報');
          const query = '顧客製番="' + event.record['製番'].value + '"';
          const paramGET = {
            'app' : appId,
            'query' : query,
            'totalCount' : true
          };
      
            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', paramGET, function(resp) {
      
                kintone.app.record.getFieldElement('集計').innerText = resp.totalCount; //表示する値の書き換え
              });

      }
      
      return event;
  });
})();