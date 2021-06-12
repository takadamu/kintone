(function() {
  "use strict";
  var eventlist = ["app.record.show.change.集計開始日のフィールドコード",
                   "app.record.edit.change.集計開始日のフィールドコード",
                   "app.record.show.change.集計終了日のフィールドコード",
                   "app.record.edit.change.集計終了日のフィールドコード"];

  kintone.events.on(eventlist, function(event) {
      // AアプリのアプリID
      var app = xxx;

      var record = event.record;
      var start_date = record.集計開始日のフィールドコード.value;
      var end_date = record.集計終了日のフィールドコード.value;
      
      // 開始日または終了日が空だったら処理終了
      if (!start_date || !end_date) {
          return;
      }

      var body = {
                  "app": app,
                  "query": '集計開始日 >= "' + start_date = '" and 集計終了日 <= "' + end_date
                 };

      // 取得
      kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function(resp) {
          // 取得したデータ数
          var num = resp.records.length;
         len(num);
      });

      function len(num) {
          record.明細数のフィールドコード.value = num;
      }

      return event;
  });
})();