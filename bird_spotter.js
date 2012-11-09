// !Parse links
if( document.location.host !== 'twitter.com' && document.links.length >= 1 ) {
	for( var l in document.links ) {
		var link = document.links[l]
		if( link.href ) {
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([a-z0-9_]+)(\?|\/|$)/i, function( s, s, s, username ) {
				if( !username.match( /^(home|intent|share|jobs|tos|privacy|images|settings|about|i|download|activity|who_to_follow|search|invitations)$/i ) ) {
					foundUser( username )
				}
			})
			link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(share|intent\/user|intent\/tweet)\?.*\b(via|screen_name|related)=([a-z0-9_]+)&?.*$/i, foundUser )
		}
	}
}

// !Parse meta tags
if( document.head.children && document.head.children.length >= 1 ) {
	for( var m in document.head.children ) {
		var tag = document.head.children[m]
		if( tag.nodeName == 'META' ) {
			if( tag.outerHTML.match( /\b(name|property)=['"]twitter:creator['"]/i ) ) {
				tag.outerHTML.replace( /\b(content|value)=['"]([^'"]+)['"]/i, foundUser )
			}
		}
	}
}

// !Parse widgets
if( document.location.host !== 'twitter.com' && document.scripts && document.scripts.length >= 1 ) {
	for( var s in document.scripts ) {
		var script = document.scripts[s]
		if( script.src && script.src.match( /https?:\/\/([^\.]+)\.twitter\.com\//i ) ) {
			script.src.replace( /\/statuses\/user_timeline\/([^\.]+)\./i, foundUser )
			script.src.replace( /\bscreen_name=([^\&]+)\&/i, foundUser )
		}
	}
}

// !Found a user
function foundUser() {
	var username = arguments[ arguments.length -1 ]
	if( username instanceof String ) {
		chrome.extension.sendRequest({
			action:	'twitterUser',
			user:	username.toLowerCase()
		})
	}
}

// !Task done
chrome.extension.sendRequest({ action: 'doneSpotting' })
