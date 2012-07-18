// Parse links
if( document.location.host != 'twitter.com' && document.links.length >= 1 ) {
	for( var l in document.links ) {
		var link = document.links[l]
		if( link.href ) {
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([a-z0-9_]+)\/?$/i, function( str, www, hash, username ) {
				if( !username.match( /^(share|jobs|tos|privacy|images|settings|about|i|download|activity|who_to_follow|search|invitations)$/i ) ) {
					foundUser( username, link )
				}
			})
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/intent\/(user|tweet)\?.*screen_name=([a-z0-9_]+)&?.*$/i, function( str, www, mid, username ) {
				foundUser( username, link )
			})
		}
	}
}


// Found a user
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