chrome.extension.sendRequest({ action: 'getOptions' }, function(res) {
	var skipSite = (res.options.onTwitter === false && document.location.host === 'twitter.com')
	
	if( !skipSite ) {
		
		// !Humans.txt file?
		if( document.location.href.match( /\/humans\.txt$/ ) ) {
			var preTags = document.getElementsByTagName('pre')
			if( preTags[0] !== undefined && preTags[0].innerText != '' ) {
				preTags[0].innerText.replace( /Twitter:[\s\t]*\@?([a-z0-9_]{1,20})/gi, function( s, user ) {
					foundUser( user )
				})
			}
		}
		
		// !Parse links
		if( document.links.length >= 1 ) {
			for( var l in document.links ) {
				var link = document.links[l]
				if( link.href ) {
					link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?(\@|%40)?([a-z0-9_]{1,20})\b/i, function( s,s,s,s, username ) {
						if( !username.match( /^(home|intent|share|jobs|tos|privacy|images|settings|about|i|download|activity|who_to_follow|search|invitations)$/i ) ) {
							foundUser( username )
						}
					})
					link.href.replace( /^https?:\/\/(www\.)?twitter\.com\/(share|intent\/user|intent\/tweet)\?.*\b([\?\&])?(via|screen_name|related)=(\@|%40)?([a-z0-9_]{1,20})\b/i, function( s,s,s,s,s,s, user ) {
						foundUser( user )
					})
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
		if( document.scripts && document.scripts.length >= 1 ) {
			for( var s in document.scripts ) {
				var script = document.scripts[s]
				if( script.src == '' && script.text.indexOf('wpFollowmeFlash') > -1 ) {
					var params = document.getElementsByTagName('param')
					for( var p in params ) {
						if( params[p].name == 'flashvars' ) {
							params[p].value.replace( /turl=https?:\/\/(www\.)?twitter\.com\/([a-z0-9_]{1,20})/i, function( s,s, user ) {
								foundUser( user )
							})
						}
					}
				}
				if( script.src && script.src.match( /https?:\/\/([^\.]+)\.twitter\.com\//i ) ) {
					script.src.replace( /\/statuses\/user_timeline\/(\@|%40)?([a-z0-9_]{1,20})\b/i, function( s, user ) { foundUser( user ) })
					script.src.replace( /\bscreen_name=(\@|%40)?([a-z0-9_]{1,20})\b/i, function( s, user ) { foundUser( user ) })
				}
			}
		}
		
		// !Parse SexyBookmarks (Wordpress plugin)
		if( typeof SHRSB_Settings === 'object' && Object.keys(SHRSB_Settings).length >= 1 ) {
			for( var s in SHRSB_Settings ) {
				if( typeof SHRSB_Settings[s].twitter_template === 'string' ) {
					SHRSB_Settings[s].twitter_template.replace( /via\+(\@|%40)?([a-z0-9_]{1,20})/, function( s, user ) { foundUser( user ) })
				}
			}
		}
		
		// !Found a user
		function foundUser( username ) {
			if( typeof username === 'string' ) {
				chrome.extension.sendRequest({
					action:	'twitterUser',
					user:	username.toLowerCase()
				})
			}
		}
		
		// !Task done
		chrome.extension.sendRequest({ action: 'doneSpotting' })
		
	}
	
})