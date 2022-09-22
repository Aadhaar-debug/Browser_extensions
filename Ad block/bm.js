
var adBlocker=({isReady:true,error:function(msg){throw new Error(msg);},noop:function(){},isFunction:function(obj){return j.type(obj)==="function";},isArray:Array.isArray,isWindow:function(obj){return obj!=null&&obj===obj.window;},isNumeric:function(obj){var realStringObj=obj&&obj.toString();return!j.isArray(obj)&&(realStringObj-parseFloat(realStringObj)+1)>=0;},isPlainObject:function(obj){var key;if(j.type(obj)!=="object"||obj.nodeType||j.isWindow(obj)){return false;}
if(obj.constructor&&!hasOwn.call(obj,"constructor")&&!hasOwn.call(obj.constructor.prototype||{},"isPrototypeOf")){return false;}
for(key in obj){}
return key===undefined||hasOwn.call(obj,key);},isEmptyObject:function(obj){var name;for(name in obj){return false;}
return true;},type:function(obj){if(obj==null){return obj+"";}
return typeof obj==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj;},globalEval:function(code){var script,indirect=eval;
    code=j.trim(code);
    if(code){if(code.indexOf("use strict")===1){script=document.createElement("script");script.text=code;document.head.appendChild(script).parentNode.removeChild(script);}else{indirect(code);}}},camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();},each:function(obj,callback){var length,i=0;if(isArrayLike(obj)){length=obj.length;
        for(;i<length;i++){if(callback.call(obj[i],i,obj[i])===false){break;}}}else{for(i in obj){if(callback.call(obj[i],i,obj[i])===false){break;}}}
return obj;},trim:function(text){return text==null?"":(text+"").replace(rtrim,"");},makeArray:function(arr,results){var ret=results||[];
    if(arr!=null){if(isArrayLike(Object(arr))){j.merge(ret,typeof arr==="string"?[arr]:arr);}else{push.call(ret,arr);}}
return ret;},inArray:function(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i);},merge:function(first,second){var len=+second.length,j=0,i=first.length;
    for(;j<len;j++){first[i++]=second[j];}
first.length=i;return first;},grep:function(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert;
    for(;i<length;i++){callbackInverse=!callback(elems[i],i);
        if(callbackInverse!==callbackExpect){matches.push(elems[i]);}}
return matches;},map:function(elems,callback,arg){var length,value,i=0,ret=[];
    if(isArrayLike(elems)){length=elems.length;for(;i<length;i++){value=callback(elems[i],i,arg);
        if(value!=null){ret.push(value);}}}else{for(i in elems){value=callback(elems[i],i,arg);
            if(value!=null){ret.push(value);}}}
return concat.apply([],ret);},guid:1,proxy:function(fn,context){var tmp,args,proxy;
    if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;}
args=slice.call(arguments,2);
proxy=function(){return fn.apply(context||this,args.concat(slice.call(arguments)));};return proxy;},now:Date.now});
var tog=true;
chrome.browserAction.onClicked.addListener(function(tab)
{tog=!tog;if(urlAdCountMap.hasOwnProperty(tab.id))
{urlAdCountMap[tab.id].bEnabled=tog;}else
{var obj={};obj.strAdCount="";
obj.bEnabled=tog;urlAdCountMap[tab.id]=obj;}
sendStatusToCS(tog,tab.id);setIcon(tog);});

function sendStatusToCS(bEnabled,tabId)
{chrome.tabs.sendMessage(tabId,{tog:bEnabled},function()
{});}


chrome.tabs.addListener(function(activeInfo){if(urlAdCountMap.hasOwnProperty(activeInfo.tabId))
{var obj=urlAdCountMap[activeInfo.tabId];console.log(activeInfo.tabId+", "+obj);chrome.browserAction.setBadgeText({text:obj.strAdCount});sendStatusToCS(tog,activeInfo.tabId);setIcon(tog);}else
chrome.browserAction.setBadgeText({text:""});});var urlAdCountMap={};chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){if(message.type==="badge")
{if(urlAdCountMap.hasOwnProperty(sender.tab.id))
{urlAdCountMap[sender.tab.id].strAdCount=message.text;}else
{var obj={};obj.strAdCount=message.text;obj.bEnabled=tog;urlAdCountMap[sender.tab.id]=obj;}
chrome.browserAction.setBadgeBackgroundColor({color:[0,153,0,255]});chrome.browserAction.setBadgeText({text:message.text});}
else if(message.type==='getTog')
{sendStatusToCS(tog,sender.tab.id);}});function adBlocker(selector,context,results,seed){var m,i,elem,nid,nidselect,match,groups,newSelector,newContext=context&&context.ownerDocument,nodeType=context?context.nodeType:9;results=results||[];if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results;}
if(!seed){if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}
context=context||document;if(documentIsHTML){if(nodeType!==11&&(match=rquickExpr.exec(selector))){if((m=match[1])){if(nodeType===9){if((elem=context.getElementById(m))){if(elem.id===m){results.push(elem);return results;}}else{return results;}}else{if(newContext&&(elem=newContext.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}}}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results;}else if((m=match[3])&&support.getElementsByClassName&&context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}}
if(support.qsa&&!compilerCache[selector+" "]&&(!rbuggyQSA||!rbuggyQSA.test(selector))){if(nodeType!==1){newContext=context;newSelector=selector;}else if(context.nodeName.toLowerCase()!=="object"){if((nid=context.getAttribute("id"))){nid=nid.replace(rescape,"\\$&");}else{context.setAttribute("id",(nid=expando));}
groups=tokenize(selector);i=groups.length;nidselect=ridentifier.test(nid)?"#"+nid:"[id='"+nid+"']";while(i--){groups[i]=nidselect+" "+toSelector(groups[i]);}
newSelector=groups.join(",");newContext=rsibling.test(selector)&&testContext(context.parentNode)||context;}
if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError){}finally{if(nid===expando){context.removeAttribute("id");}}}}}}
return select(selector.replace(rtrim,"$1"),context,results,seed);}