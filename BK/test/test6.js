(function() {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {

// 関連レコード一覧の参照先アプリIDを取得
    var related = kintone.app.getRelatedRecordsTargetRecordId('reference');

    console.log(related);
  });
})();

