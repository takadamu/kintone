window.RelatedRecordsFieldManager = (function(fieldCode){
  var RelatedRecordsFieldManager = function(fieldCode){
    this.fieldCode = fieldCode;
    this.property = this.fieldProperties[fieldCode].referenceTable;
    this.targetAppId = this.property.relatedApp.app;
  }
  RelatedRecordsFieldManager.prototype = {
    selfAppId: kintone.app.getId(),
    records: [],
    limit: 500,
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
          ' offset ' + this.records.length
      }).then(function(response){
        _this.records = _this.records.concat(response.records);
        return response.records.length === _this.limit ? _this.getRecords(record) : _this.records;
      });
    }
  }
  return RelatedRecordsFieldManager;
})();