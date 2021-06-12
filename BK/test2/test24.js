//AAAにはカウントしたい関連レコードのフィールドコードを設定
//BBBには関連レコードの条件を設定。なおBBB1には関連レコードに対応しているアプリのフィールドコードを、BBB2には関連レコードを設置しているアプリのフィールドコードを設定してください
//CCCには関連レコードの件数を表示させたいフィールドコードを設定してください
 
(function() {
  'use strict';
  const events = [
    // 'app.record.index.show',
    'app.record.detail.show'
    // 'app.record.edit.show',
    // 'app.record.create.show',
    ];
  kintone.events.on(events, function(event) {
    const appId = kintone.app.getRelatedRecordsTargetAppId('販売情報');
    const query = '顧客製番="' + event.record['製番'].value + '"';
    const paramGET = {
      'app' : appId,
      'query' : query,
      'totalCount' : true
    };
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGET, (resp)=> {
      // event.record['集計'].value = resp.totalCount;
      // kintone.app.record.set(event);
    // });

    // kintone.api(kintone.api.url('/k/v1/records', true), 'GET', { //データの取得
    //   app: 104
    // }).then(function(response){
    //   ... //データ整理
      kintone.app.record.getFieldElement('集計').innerText = resp.totalCount; //表示する値の書き換え
    });



    // return event;
  });
})();