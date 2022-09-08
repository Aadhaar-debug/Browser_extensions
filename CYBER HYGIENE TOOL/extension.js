
(function($){


    var port, calls = [], calls_data = {}, filter, html = '', obj_input_filter,cols_length = 0,tabs = {}, table_obj,records_limit = 400;
    var cols = {'requestId':5,'statusCode':5,'ip':5,'url':60,'type':5,'timeStamp':5,'tabId':5,'fromCache':5,'method':5};
    var msg_types = { "beforeSendHeaders" :1, "headersReceived":1 , "completed" : 1}

    var filter_capture = true;

    var debug = 1;

    function init(){

        chrome.storage.local.get('filter' ,getSavedFilter);


        port = chrome.runtime.connect({name: "start_listen"});

        port.onMessage.addListener(onMessage);

        table_obj = $('<table></table>').attr({'id' : 'net_content'}).appendTo('#main_content');

        for(i in cols){
            cols_length++;
            html+='<th>'+i+'</th>';
        }

        $('<tr id="net_header"></tr>').html(html).appendTo('#net_content');


        obj_input_filter = $('#net_filter');

        obj_input_filter.change(filterChanged).focus();

        $('#clear_results').click(function(){
            location.reload();
        });

        $('#filter_apply').click(function(){
            filterChanged();
        });

        $('#filter_clear').click(function(){
            obj_input_filter.val('');
            filterChanged();
        });



        $('#custom_style').empty().text('.net_details{ max-width : '+($('#net_content').width()-10)+'px }').appendTo('head');

    }



    function actionHover(e){
        log('actionHover',e.target)
        var tid = parseInt($(this).closest('tr').attr('tabId'));


        chrome.tabs.get(tid, function(tab){

            var html = '';
            for(i in tab){
                html += i+' : '+tab[i]+"<br>\n";
            }

            showTip(html,e);
        });
    }


    function showTip(msg,e){


        log(e)
        $('#tooltip').remove();

        var obj = $('<div id="tooltip"></div>').html(msg).css({ top:e.pageY, left:e.pageX}).hide().appendTo('body');

        obj.fadeIn(200,function(){

            setTimeout(function(){

                obj.fadeOut(400,function(){
                    obj.remove();
                });

            },10000)

        })
    }



    function getSavedFilter(data){

        obj_input_filter.val(data['filter'])
        filterChanged();
    }



    function addCallRow(msg){
        log('msg : ',msg);

        try{

            html = '';

            for(i in cols){
                html += i == 'url' ? '<td class="net_td"><a href="'+msg[i]+'" target="_blank" > '+msg[i]+'</a></td>' : '<td class="net_td" >'+msg[i]+'</td>';
            }

            var tmp_row = $('<tr tabId="'+msg.tabId+'"></tr>').html(html);

            if(calls_data[msg['requestId']] &&  calls_data[msg['requestId']]['tr_obj']){
                calls_data[msg['requestId']]['tr_obj'].replaceWith(tmp_row);
            }
            else{
                tmp_row.insertAfter('#net_header')
            }


            tmp_row.children().first().click(actionHover);
            addCallDetails(msg,tmp_row);
        }
        catch (e){
            log(e);
        }
    }






    function addCallDetails(msg,call_row){
        try{

            var details_html = '<b>Full URL: '+msg['url']+"</b><br>\n";
            var requestId = msg['requestId'];
            var title ,header_direction;

            log(requestId,calls_data[requestId]);

            calls_data[requestId]['tr_obj'] = call_row.click(function(e){
                try{console.log(this); /** console.trace(); /**/ }catch(e){}
                $(this).next().find('div').slideToggle();
            });


            if(msg['responseHeaders']){
                title = 'Response Headers'
                header_direction = 'responseHeaders'
            }

            else if(msg['requestHeaders']){
                title = 'Request Headers';
                header_direction = 'requestHeaders'

            }
            else{
                return;
            }


            for(i=0;i<msg[header_direction].length;i++){
                details_html += '<b>'+msg[header_direction][i].name +'</b> : '+msg[header_direction][i].value+"<br>\n";
            }

            if(calls_data[requestId] && calls_data[requestId]['tr_details']){

                var obj = $('<fieldset><legend>'+title+'</legend>'+details_html+'</fieldset>').appendTo(calls_data[requestId]['tr_details'].find('div'));
//                calls_data[requestId]['tr_obj'].attr({'title' : details_html }).tooltip();
            }
            else{
                calls_data[requestId]['tr_details'] = $('<tr></tr>').insertAfter(call_row).html('<td colspan="'+cols_length+'"><div class="net_details"><fieldset><legend>'+title+'</legend>'+details_html+'</fieldset></div></td>');
                calls_data[requestId]['tr_details'].find('div').hide();
            }

        }
        catch (e){
            log(e);
        }
    }







    function filterChanged(){

        filter = obj_input_filter.val();

        chrome.storage.local.set({'filter' : filter },function(){});

       log('filter:',filter);
       log('calls length',calls.length);



        $('#main_content').find('tr[id!=net_header]').remove();

        for(var i = 0; i<calls.length; i++ ){

            if(filter && calls_data[calls[i]] && calls_data[calls[i]].url.indexOf(filter) == -1) continue;

            log('found: ',calls_data[calls[i]].url.indexOf(filter),calls_data[calls[i]].url);
            calls_data[calls[i]]['tr_obj'] = null;
            calls_data[calls[i]]['tr_details'] = null;

            for(j in msg_types){
                addCallRow( calls_data[calls[i]][j] );
            }
        }

    }



    function onMessage(msg) {
        log(msg);


        var call_id = msg['req_details']['requestId'];
        var call_url = msg['req_details']['url'];
        if(filter_capture && filter && call_url.indexOf(filter) == -1) return;



        if(!calls_data[call_id]){
            calls_data[call_id] = {'url' : call_url};
            calls.push(call_id);

            if(calls.length > records_limit){
                var last_call = calls.shift();
                calls_data[last_call]['tr_obj'].remove();
                calls_data[last_call]['tr_details'].remove();
                delete calls_data[last_call];
            }
        }

        calls_data[call_id][msg['type']] = msg['req_details'];


        if(filter && call_url.indexOf(filter) == -1) return;
        addCallRow(msg['req_details']);
    }



    function log(){
        if(debug)try{console.log(arguments); /** console.trace(); /**/ }catch(e){}
    }


    init();

})($);
