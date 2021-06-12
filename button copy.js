(function() {
  "use strict";
  
  var getRecords = function(app, tmpRecords){
    var limit = 500;
    var tmpRecords = tmpRecords || [];
    return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
      app: app,
      query: 'limit ' + limit +' offset ' + tmpRecords.length
    }).then(function(response){
      tmpRecords = tmpRecords.concat(response.records);
      return response.records.length === limit ? getRecords(app, tmpRecords) : tmpRecords;
    });
  }
  var putRecords = function(app, records){
    var limit = 100;
    return Promise.all(
      records.reduce(function(recordsBlocks, record){
        if(recordsBlocks[recordsBlocks.length - 1].length === limit){
          recordsBlocks.push([record]);
        }else{
          recordsBlocks[recordsBlocks.length - 1].push(record);
        }
        return recordsBlocks;
      }, [[]]).map(function(recordsBlock){
        return kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', {
          app: app,
          records: recordsBlock
        });
      })
    );
  }
  kintone.events.on('app.record.index.show', function(event){
    if(document.getElementById('updateButton') !== null) return;
    var button = document.createElement('button');
    button.innerHTML = '一括更新';
    button.id = 'updateButton';
    kintone.app.getHeaderMenuSpaceElement().appendChild(button);
    button.addEventListener('click', function(){
      Promise.all([
        getRecords(kintone.app.getId()),
        RelatedRecordsFieldManager.prototype.getFieldProperties()
      ]).then(function(responses){
        return Promise.all(responses[0].map(function(selfRecord){
          return (new RelatedRecordsFieldManager('販売情報')).getRecords(selfRecord).then(function(relatedRecords){
            return {
              id: selfRecord.レコード番号.value,
              record: {
                集計: {
                  value: relatedRecords.length
                }
              }
            };
          });
        }));
      }).then(function(records){
        putRecords(kintone.app.getId(), records).then(function(){
          alert('更新しました。');
          location.reload();
        });
      });
    });
    return event;
  });
})();