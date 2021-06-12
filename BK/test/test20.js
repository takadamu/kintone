
/*
 * value of RelatedRecords program
 * Copyright (c) 2016 Cybozu
 *
 * Licensed under the MIT License
*/
(function() {
  'use strict';

  // 関連レコードの絞り込みに利用するフィールドコード
  var FIELDNAME_A = '顧客製番'; // Aアプリ
  var FIELDNAME_B = '販売情報'; // Bアプリ

  kintone.events.on('app.record.detail.show', function(event) {

      // 関連レコードで取得しているアプリの対象レコードを全件取得
      function fetchRecords(opt_Field, opt_offset, opt_limit, opt_records) {
          var Id = kintone.app.getRelatedRecordsTargetAppId('76');
          var offset = opt_offset || 0;
          var limit = opt_limit || 100;
          var allRecords = opt_records || [];
          var params = {app: Id, query: opt_Field + ' order by レコード番号 asc limit ' + limit + ' offset ' + offset};
          return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params).then(function(resp) {
              allRecords = allRecords.concat(resp.records);
              if (resp.records.length === limit) {
                  return fetchRecords(opt_Field, offset + limit, limit, allRecords);
              }
              return allRecords;
          });
      }

    //   // 関連レコードの「表示するレコードの条件」に合わせてクエリを作成
      var CompanyNameValue = event.record[FIELDNAME_A].value;
      var opt_Field = FIELDNAME_B + '=' + '"' + CompanyNameValue + '"';

      fetchRecords(opt_Field).then(function(records) {
          // スペースフィールドにBアプリのレコード数を反映
          var num = records.length;
          var divTotalAmount = document.createElement('div');
          divTotalAmount.style.fontWeight = 'bold';
          divTotalAmount.style.textAlign = 'center';
          divTotalAmount.style.fontSize = 12;
          divTotalAmount.innerHTML = num;
          kintone.app.record.getSpaceElement('num').appendChild(divTotalAmount);
          return event;
      });
  });
})();
