(function() {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {
    kintone.app.getFieldElements(fieldCode);
  });
})();