// !Storage
var tabs = {}

// !Incoming request
chrome.extension.onRequest.addListener( function( request, sender, response ) {
	switch( request.action ) {
		
		// !Bird spotted
		case 'twitterUser':
			
			// !new tab, or tab changed URL
			if( tabs[ 't'+ sender.tab.id ] === undefined || tabs[ 't'+ sender.tab.id ].href != request.href ) {
				tabs[ 't'+ sender.tab.id ] = {
					users: {},
					href: request.href
				}
			}
			
			// !add to users
			if( tabs[ 't'+ sender.tab.id ].users[ request.user ] === undefined ) {
				fetch_bird( request.user, function( bird ) {
					if( bird ) {
						tabs[ 't'+ sender.tab.id ].users[ request.user.toLowerCase() ] = {
							screen_name:			bird.screen_name,
							id_str:				bird.id_str,
							name:				bird.name,
							location:			bird.location,
							url:				bird.url,
							description:			bird.description,
							protected:			bird.protected,
							followers_count:		bird.followers_count,
							friends_count:			bird.friends_count,
							created_at:			bird.created_at,
							utc_offset:			bird.utc_offset,
							verified:			bird.verified,
							statuses_count:			bird.statuses_count,
							lang:				bird.lang,
							profile_image_url_https:	bird.profile_image_url_https,
							following:			bird.following,
							follow_request_sent:		bird.follow_request_sent
						}
					}
				})
			}
			
			// !display icon
			chrome.pageAction.show( sender.tab.id )
			
			// !all good
			response({ status: 'ok' })
			break
		
		// !Popup wants something
		case 'getUsers':
			if( tabs[ 't'+ request.tabId ] ) {
				response( tabs[ 't'+ request.tabId ] )
			}
			break
		
	}
})

// !Tab closed
chrome.tabs.onRemoved.addListener( function( tabId, removeInfo ) {
	if( tabs[ 't'+ tabId ] !== undefined ) {
		delete tabs[ 't'+ tabId ]
	}
})

// Get user from Twitter API
function fetch_bird( username, cb ) {
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {
		if( xhr.readyState == 4 ) {
			var data = xhr.responseText.trim()
			if( data.length >= 2 && data.substr(0,1) == '{' && data.substr( data.length -1, 1 ) == '}' ) {
				data = JSON.parse( data )
				console.log( 'User '+ username +': ', data )
				if( data && data.screen_name !== undefined ) {
					cb( data )
				} else {
					cb( false )
				}
			} else {
				cb( false )
			}
		}
	}
	xhr.open( 'GET', 'https://api.twitter.com/1/users/show.json?screen_name='+ username +'&include_entities=false&dnt=true', true )
	xhr.send()
}
