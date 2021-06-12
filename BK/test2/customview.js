(function() {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {
      if (event.viewName !== 'カスタマイズビュー') {
          return;
      }

      var records = event.records;
      if (records.length === 0) {
          document.getElementById('my-customized-view').innerText = '表示するレコードがありません';
          return;
      }

      var recUrl = location.protocol + '//' + location.hostname + '/k/' + kintone.app.getId() + '/show#record=';
      var myRecordSpace = document.getElementById('my-tbody');
      myRecordSpace.innerText = '';

      for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var row = myRecordSpace.insertRow(myRecordSpace.rows.length);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);

          var tmpA = document.createElement('a');
          tmpA.href = recUrl + record.製番.value;
          tmpA.innerText = record.製品.value;
          cell1.appendChild(tmpA);
          
          cell2.innerText = record.品番.value;
          
          var createdAt = new Date(record.文字列__複数行_.value);
          cell3.innerText = createdAt.toLocaleString();
      }
  });
})();