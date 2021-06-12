(function() {
    "use strict";
   
     // レコード一覧画面
      kintone.events.on(['app.record.index.show', 'app.record.detail.show'], function(event) {
        var manager = new KintoneRecordManager;
        manager.getRecords(function(records) {
            // レコード取得後の処理
            console.log('KintoneRecordManager');
            console.log(records);
        });

        RelatedRecordsFieldManager.prototype.getFieldProperties().then(function(){
            var relatedRecordsField = new RelatedRecordsFieldManager('販売情報');
            event.records.forEach(function(record, index){
              relatedRecordsField.getRecords(record).then(function(records){
                if(records.length){
                  kintone.app.getFieldElements('製番')[index].innerText = 1;
                 } else {
                  kintone.app.getFieldElements('製番')[index].innerText = 0;
                 }
                 console.log('RelatedRecordsFieldManager');
                 console.log(records);
              });
            });
          });

        return event;
    });
  
    /**
     * kintoneと通信を行うクラス
     */
    var KintoneRecordManager = (function() {
        KintoneRecordManager.prototype.records = [];    // 取得したレコード
        KintoneRecordManager.prototype.appId = null;    // アプリID
        KintoneRecordManager.prototype.query = '';      // 検索クエリ
        KintoneRecordManager.prototype.limit = 100;     // 一回あたりの最大取得件数
        KintoneRecordManager.prototype.offset = 0;      // オフセット
  
        function KintoneRecordManager() {
            this.appId = kintone.app.getId();
            this.records = [];
        }
  
        // すべてのレコード取得する
        KintoneRecordManager.prototype.getRecords = function(callback) {
            kintone.api(
                kintone.api.url('/k/v1/records', true),
                'GET',
                {
                    app: this.appId,
                    query: this.query + (' limit ' + this.limit + ' offset ' + this.offset)
                },
                (function(_this) {
                    return function(res) {
                        var len;
                        Array.prototype.push.apply(_this.records, res.records);
                        len = res.records.length;
                        _this.offset += len;
                        if (len < _this.limit) { // まだレコードがあるか？
                            _this.ready = true;
                            if (callback !== null) {
                                callback(_this.records); // レコード取得後のcallback
                            }
                        } else {
                            _this.getRecords(callback); // 自分自身をコール
                        }
                    };
                })(this)
            );
        };
        console.log('records');
        console.log(KintoneRecordManager.prototype.records);
        console.log('query');
        console.log(KintoneRecordManager.prototype.query);
        console.log('appId');
        console.log(KintoneRecordManager.prototype.appId);
        console.log('limit');
        console.log(KintoneRecordManager.prototype.limit);
        console.log('offset');
        console.log(KintoneRecordManager.prototype.offset);
  
        return KintoneRecordManager;
    })();

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
          query: '',
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
        console.log('query');
        console.log(RelatedRecordsFieldManager.prototype.query);
        console.log('records');
        console.log(RelatedRecordsFieldManager.prototype.records);
        console.log('appId');
        console.log(RelatedRecordsFieldManager.prototype.selfAppId);
        console.log('limit');
        console.log(RelatedRecordsFieldManager.prototype.limit);
        console.log('offset');
        console.log(RelatedRecordsFieldManager.prototype.offset);
    
        return RelatedRecordsFieldManager;
      })();

  })();