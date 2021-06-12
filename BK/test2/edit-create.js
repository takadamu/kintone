(function() {
  'use strict';
  kintone.events.on([
    'app.record.edit.show',
    'app.record.create.show',
  ], function(event){
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
})();