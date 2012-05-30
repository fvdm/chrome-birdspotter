if( document.location.host != 'twitter.com' && document.links.length >= 1 ) {
	for( var l in document.links ) {
		var link = document.links[l];
		if( link.href ) {
			link.href.replace( /^https?:\/\/twitter\.com\/(#!\/)?([a-z0-9_]+)$/, function( str, hash, user ) {
				chrome.extension.sendRequest({
					action:	'twitterUser',
					user:	{
						username:	user,
						title:		link.title ? link.title : false,
						text:		link.innerText && link.innerText != '' ? link.innerText : false
					}
				});
			});
		}
	}
}