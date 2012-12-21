function chrome_birdspotter() {
	// !Parse links
	if( document.location.host !== 'twitter.com' && document.links.length >= 1 ) {
		for( var l in document.links ) {
			var link = document.links[l]
			if( link.href ) {
				link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([a-z0-9_]{1,20})\b/i, function( s, s, s, username ) {
					if( !username.match( /^(home|intent|share|jobs|tos|privacy|images|settings|about|i|download|activity|who_to_follow|search|invitations)$/i ) ) {
						foundUser( username )
					}
				})
				link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(share|intent\/user|intent\/tweet)\?.*\b([\?\&])?(via|screen_name|related)=([a-z0-9_]{1,20})\b/i, foundUser )
			}
		}
	}
	
	// !Parse meta tags
	if( document.head.children && document.head.children.length >= 1 ) {
		for( var m in document.head.children ) {
			var tag = document.head.children[m]
			if( tag.nodeName == 'META' && tag.outerHTML.match( /\b(name|property)=['"]twitter:(creator|site)['"]/i ) ) {
				foundUser( tag.content || tag.value )
			}
		}
	}
	
	// !Parse widgets
	if( document.location.host !== 'twitter.com' && document.scripts && document.scripts.length >= 1 ) {
		for( var s in document.scripts ) {
			var script = document.scripts[s]
			if( script.src && script.src.match( /https?:\/\/([^\.]+)\.twitter\.com\//i ) ) {
				script.src.replace( /\/statuses\/user_timeline\/([a-z0-9_]{1,20})\b/i, foundUser )
				script.src.replace( /\bscreen_name=([a-z0-9_]{1,20})\b/i, foundUser )
			}
		}
	}
	
	// !Parse SexyBookmarks (Wordpress plugin)
	if( typeof SHRSB_Settings === 'object' && Object.keys(SHRSB_Settings).length >= 1 ) {
		for( var s in SHRSB_Settings ) {
			if( typeof SHRSB_Settings[s].twitter_template === 'string' ) {
				SHRSB_Settings[s].twitter_template.replace( /via\+%40([a-z0-9_]{1,20})/, foundUser )
			}
		}
	}
	
	// !Found a user
	function foundUser() {
		var username = arguments[ arguments.length -1 ]
		if( typeof username === 'string' ) {
			username.replace( /^@([a-z0-9]{1,20}$/i, function( s, u ) {
				chrome.extension.sendRequest({
					action:	'twitterUser',
					user:	u.toLowerCase()
				})
			})
		}
	}
	
	// !Task done
	chrome.extension.sendRequest({ action: 'doneSpotting' })
}

chrome_birdspotter()