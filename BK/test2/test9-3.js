(function() {
  "use strict";
  kintone.events.on([
    'app.record.detail.show'
  ], function(event){
    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
      event.records.forEach(function(event){
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

          // }
        // });
      });
    });
  });
  var RelatedRecordsFieldManager = (function(fieldCode){
    function RelatedRecordsFieldManager(fieldCode) {
      this.fieldCode = fieldCode;
      this.targetAppId = kintone.app.getRelatedRecordsTargetAppId(fieldCode);
      this.property = this.fieldProperties[fieldCode].referenceTable;
    }
    RelatedRecordsFieldManager.prototype = {
      selfAppId: kintone.app.getId(),
      records: [],
      limit: 1,
      //limit: 500,
      offset: 0,
      getFieldProperties: function(){
        return kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', {
          app: RelatedRecordsFieldManager.prototype.selfAppId,
        }).then(function(response){
          RelatedRecordsFieldManager.prototype.fieldProperties = response.properties;
        });
      },
      query: function(record){
        return (
          this.property.condition.relatedField +
          '="' +
          record[this.property.condition.field].value +
          (this.property.filterCond ? '" and ' : '"') +
          this.property.filterCond
        );
      },
      getRecords: function(record){
        var _this = this;
        return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
          app: this.targetAppId,
          query:
            this.query(record) +
            ' order by ' + this.property.sort +
            ' limit ' + this.limit +
            ' offset ' + this.offset
        }).then(function(response){
          return response.records;
          /*_this.records = _this.records.concat(response.records);
          _this.offset += response.records.length;
          if(response.records.length === _this.limit){
            return _this.getRecords(record);
          }else{
            return _this.records;
          }*/
        });
      }
    }
    return RelatedRecordsFieldManager.value;
  })();
})();