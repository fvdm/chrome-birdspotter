if( document.location.host != 'twitter.com' && document.links.length >= 1 ) {
	for( var l in document.links ) {
		var link = document.links[l]
		if( link.href ) {
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([a-z0-9_]+)\/?$/i, function( str, www, hash, username ) {
				if( username != 'share' ) {
					foundUser( username, link )
				}
			})
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/intent\/(user|tweet)\?.*screen_name=([a-z0-9_]+)&?.*$/i, function( str, www, mid, username ) {
				foundUser( username, link )
			})
		}
	}
}

function foundUser( username, link ) {
	chrome.extension.sendRequest({
		action:	'twitterUser',
		user:	{
			username:	username,
			title:		link.title ? link.title : false,
			text:		link.innerText && link.innerText != '' ? link.innerText : false
		},
		href:	document.location.href
	})
}