(function() {
  "use strict";

// 関連レコードのフィールド名から、参照先アプリIDを取得する事も出来る。アプリテンプレート化するならコチラの関数を使う。
  var related = kintone.app.getRelatedRecordsTargetAppId('関連レコード一覧');    

  // 「商品種別」と集計結果を出力するスペースの「要素ID名」を連想配列でセットする
  var arrSumRelatedRecords = "num";

  //レコードの編集、詳細画面で適用する
  kintone.events.on(['app.record.detail.show'], function(event) {

  
      var record = event.record;			// 引数のレコード情報を変数に格納
      var client_rid = event.recordId;	// 表示されているレコード番号を取得
      var total_sum_amount = 0;			// 個人別の購入総合計を初期化

  // 「商品種別」の数だけループ
  for(var item_kind in arrSumRelatedRecords){

      //小計を出力するIDタグ名(kintone画面のスペース名)
      var dispElement = arrSumRelatedRecords[item_kind];
      
      // 変数の初期化
        var offset = 0;				// 100件毎に取得してきているので、そのためのオフセット
        var loop_end_flg = false;
        var records = new Array();
         var RelatedRecordsNum = 0;	// 関連レコード件数
        
        // 関連レコードを100件ずつ取得する(100個はkintoneから取得できるレコード数の上限値のため)
        while(!loop_end_flg){
            var query = '商品種別="'+ item_kind +'" and 顧客ID="'+ client_rid +'"' +
                ' limit 100 offset ' + offset;
            query = encodeURIComponent(query);
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ related + '&query=' + query;
 
            // 同期リクエストを行う
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            //取得したレコードをArrayに格納
            var resp_data = JSON.parse(xmlHttp.responseText);
 
       // まだ1件以上あるなら
            if(resp_data.records.length > 0){
        //レコードデータを変数に格納
                for(var i = 0; resp_data.records.length > i; i++){
                    records.push(resp_data.records[i]);
                    // 関連レコード数をカウント
                    RelatedRecordsNum = RelatedRecordsNum+1;
                }
                offset += resp_data.records.length;
                
            // 全ての関連レコードを取得したら終了
            }else{
                loop_end_flg = true;
            }
        }
        

     //小計金額を算出
        var amount = 0;
        for (var i = 0; i < records.length; i++) {
            amount = amount + parseFloat(records[i].金額.value);
        }
        
     //画面に表示する
        var divTotalAmount = document.createElement('div');
        divTotalAmount.style.fontWeight = 'bold';
        divTotalAmount.style.textAlign = 'right';
        divTotalAmount.style.fontSize = 12;
        var wString = String(amount.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        
        // 関連レコードのページングには、現在ページ/全ページみたいな表示が無いので、総レコード数を付与しておく
        divTotalAmount.innerHTML = "\\" + wString + "(" + RelatedRecordsNum + "件)";
        kintone.app.record.getSpaceElement(dispElement).appendChild(divTotalAmount);		  

    // 各商品の売買合計を取っておく
    total_sum_amount = total_sum_amount + amount;

  }

  //「商品種別」に分けていない「総合計」を表示する。
      var divTotalAmount = document.createElement('div');
      divTotalAmount.style.fontWeight = 'bold';
      divTotalAmount.style.textAlign = 'right';
      divTotalAmount.style.fontSize = 12;
      var wString = String(total_sum_amount.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
      divTotalAmount.innerHTML = "\\" + wString;
  kintone.app.record.getSpaceElement("TotalAmount").appendChild(divTotalAmount);
  
  

      return event;

  });
})();