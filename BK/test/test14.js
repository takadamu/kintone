(function() {
  "use strict";
  kintone.events.on([
    'app.record.index.show'
  ], function(event){
    RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
      var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
      event.records.forEach(function(record, index){
        relatedRecordsField.getRecords(record).then(function(records){
          if(records.length){
            var valrecord = kintone.app.getFieldElements('製番')[index];
            var valrecords = valrecord.getAttribute('');
            console.log(valrecords);

            // console.log(records);
            // kintone.app.getRecords('顧客製番')[index].style.background = '#f00';



            // kintone.app.getFieldElements('製番')[index].style.background = '#f00';



            // kintone.app.getFieldElements('製番')[index].style.background = '#f00';



            // var seibanTD = kintone.app.getFieldElements('製番')[index];
            // var valrecord = (seibanTD).parent('tr');
            // valrecord.classList.add("valrecords");



            // var valrecord = document.getElementsByClassName(".recordlist-row-gaia");
            // valrecord.classList.add("valrecords");
            // document.getElementsByClassName("valrecords");



          }
        });
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
    return RelatedRecordsFieldManager;
  })();
})();