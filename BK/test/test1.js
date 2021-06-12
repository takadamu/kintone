(function() {
	"use strict";
	kintone.events.on('app.record.detail.show', function(event){
	// アプリID取得
	var appId = event.appId;
	
	// レコード番号の取得
	var recordId = event.recordId;
	
	alert('アプリID: ' + appId + ', レコード番号: ' + recordId);
	
	});
})();