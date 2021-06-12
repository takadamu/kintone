(function() {
  'use strict';
  const events = [
    // 'app.record.index.show',
    'app.record.detail.show'
    ];
  kintone.events.on(events, function(event) {
    const appId = kintone.app.getRelatedRecordsTargetAppId('販売情報');
    const query = '顧客製番="' + event.record['製番'].value + '"';
    const paramGET = {
      'app' : appId,
      'query' : query,
      'totalCount' : true
    };
    // kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGET, (resp)=> {
    //   kintone.app.record.getFieldElement('集計').innerText = resp.totalCount; //表示する値の書き換え
    // });

    kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', paramGET, function(resp) {

      kintone.app.record.getFieldElement('集計').innerText = resp.totalCount; //表示する値の書き換え
      });

    //   // success
    //   console.log(resp.totalCount);
    // }, function(error) {
    //   // error
    //   console.log(error);
    // });

  });
})();