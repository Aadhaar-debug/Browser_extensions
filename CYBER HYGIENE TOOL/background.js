

(function(){


  var url_filter_obj = {'urls':['*://*/*']};
  var post_obj = null;
  var net_win; // the output window object


  var net_url = chrome.extension.getURL('blank.html');
  var win_properties = {'url': net_url , 'type' : 'popup', 'width' : 1200 , 'height' : 700 }


  function beforeRequest(req_details){
      try{console.log(req_details); /** console.trace(); /**/ }catch(e){}
      if(post_obj) post_obj.postMessage({'type' : 'beforeRequest' , 'req_details' : req_details});

  }


  function beforeSendHeaders(req_details){
      try{console.log(req_details); /** console.trace(); /**/ }catch(e){}
      if(post_obj) post_obj.postMessage({'type' : 'beforeSendHeaders' , 'req_details' : req_details});
  }

  function headersReceived(req_details){
      try{console.log(req_details); /** console.trace(); /**/ }catch(e){}
      if(post_obj) post_obj.postMessage({'type' : 'headersReceived' , 'req_details' : req_details});
  }



  function completed(req_details){
      try{console.log(req_details); /** console.trace(); /**/ }catch(e){}
      if(post_obj) post_obj.postMessage({'type' : 'completed' , 'req_details' : req_details});
  }



  function errorOccurred(req_details){
      try{console.log(req_details); /** console.trace(); /**/ }catch(e){}
      if(post_obj) post_obj.postMessage({'type' : 'errorOccurred' , 'req_details' : req_details});
  }


  function setIcon(active) {

      var icon = active ? 'img0001-modified-modified.png' : 'img0001-modified-modified.png';
      chrome.browserAction.setIcon({'path' : chrome.extension.getURL(icon)},function(){});
  }


  chrome.runtime.onConnect.addListener(function(port) {

      try{console.log(port); /** console.trace(); /**/ }catch(e){}
      console.assert(port.name == "start_listen");
      post_obj = port;

      setIcon(true);
      webRequestListener(true);

      post_obj.onDisconnect.addListener(function(){
          webRequestListener(false);
          setIcon(false);
          net_win = post_obj = null;
      })


  });

  chrome.browserAction.onClicked.addListener(function (){

//        chrome.tabs.create({'url': net_url}, function(tab) {});return;

      if(net_win){
          chrome.windows.getAll(function(arr){
              for(var i=0; i<arr.length; i++){
                  if(arr[i].id == net_win.id ){

                      chrome.windows.update (net_win.id,  { focused : true } );
                      return;
                  }
              }

              chrome.windows.create(win_properties, function(tab) {
                  net_win = tab;
              });

          })
          return;

      }

      chrome.windows.create(win_properties, function(tab) {
          net_win = tab;
      });
  });


//    chrome.webRequest.onBeforeRequest.addListener(beforeRequest,url_filter_obj);

  function webRequestListener(listen){

      chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendHeaders);
      chrome.webRequest.onHeadersReceived.removeListener(headersReceived);
      chrome.webRequest.onCompleted.removeListener(completed);

      if(listen){
          chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders,url_filter_obj,["requestHeaders"]);
          chrome.webRequest.onHeadersReceived.addListener(headersReceived,url_filter_obj,["responseHeaders"]);
          chrome.webRequest.onCompleted.addListener(completed,url_filter_obj);

      }
  }

  setIcon(false);
//    chrome.webRequest.onErrorOccurred.addListener(errorOccurred,url_filter_obj);

})();













(function removeAdvertisementAndBlockingElements () {
$('.inRek').remove();
$('.mgbox').remove();

Array.from(document.getElementsByTagName("img")).forEach(function (e) {
    if (!e.src.includes(window.location.host)) {
        e.remove()
    }
});    

Array.from(document.getElementsByTagName("div")).forEach(function (e) {
    var currentZIndex = parseInt(document.defaultView.getComputedStyle(e, null).zIndex);
    if (currentZIndex > 999) {
        console.log(parseInt(currentZIndex));
        e.remove()
    }
});
})();


