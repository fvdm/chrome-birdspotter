// !Parse links
if( document.location.host != 'twitter.com' && document.links.length >= 1 ) {
	for( var l in document.links ) {
		var link = document.links[l]
		if( link.href ) {
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([a-z0-9_]+)(\?|\/|$)/i, function( str, www, hash, username ) {
				if( !username.match( /^(home|intent|share|jobs|tos|privacy|images|settings|about|i|download|activity|who_to_follow|search|invitations)$/i ) ) {
					foundUser( username )
				}
			})
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/intent\/(user|tweet)\?.*\b(screen_name|related)=([a-z0-9_]+)&?.*$/i, function( str, www, mid, username ) {
				foundUser( username )
			})
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/share\?.*\bvia=([a-z0-9_]+)&?.*$/i, function( str, www, username ) {
				foundUser( username )
			})
		}
	}
}

// !Parse meta tags
if( document.head.children && document.head.children.length >= 1 ) {
	for( var m in document.head.children ) {
		var tag = document.head.children[m]
		if( tag.nodeName == 'META' ) {
			if( tag.outerHTML.match( /\b(name|property)=['"]twitter:creator['"]/i ) ) {
				tag.outerHTML.replace( /\b(content|value)=['"]([^'"]+)['"]/i, function( s, k, user ) {
					foundUser( user )
				})
			}
		}
	}
}

// !Parse widgets
if( document.location.host != 'twitter.com' && document.scripts && document.scripts.length >= 1 ) {
	for( var s in document.scripts ) {
		var script = document.scripts[s]
		if( script.src && script.src.match( /https?:\/\/([^\.]+)\.twitter\.com\//i ) ) {
			script.src.replace( /\/statuses\/user_timeline\/([^\.]+)\./i, function( s, user ) {
				foundUser( user )
			})
			script.src.replace( /\bscreen_name=([^\&]+)\&/i, function( s, user ) {
				foundUser( user )
			})
		}
	}
}

// !Found a user
function foundUser( username ) {
	chrome.extension.sendRequest({
		action:	'twitterUser',
		user:	username.toLowerCase()
	})
}

// !Task done
chrome.extension.sendRequest({ action: 'doneSpotting' })
