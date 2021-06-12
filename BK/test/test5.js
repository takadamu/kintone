(function() {
  'use strict';
  kintone.events.on('app.record.detail.show', function(event) {
    var record = kintone.app.record.get();
    console.log(record);
  });
})();

