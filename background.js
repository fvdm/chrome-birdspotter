// !Storage
var tabs = {}
var prefs = {}
var defaults = {
	avatars:	true,
	apilookup:	true,
	dnt:		true,
	https:		true,
	click:		'intent',	// intent, tab, custom, nothing
	custom_url:	'',
	custom_target:	'_blank'
}

// !Incoming request
chrome.extension.onRequest.addListener( function( request, sender, response ) {
	
	// !new tab, or tab changed URL
	if( tabs[ 't'+ sender.tab.id ] === undefined || tabs[ 't'+ sender.tab.id ].href != sender.tab.url ) {
		tabs[ 't'+ sender.tab.id ] = {
			users: {},
			href: sender.tab.url
		}
	}
	
	switch( request.action ) {
		
		// !API limit
		case 'apiLimit':
			apiLimit( function( res ) {
				response({
					status: 'ok',
					limit: res
				})
			})
			break;
		
		case 'getOptions':
			chrome.storage.sync.get( 'options', function( res ) {
				response({
					options: res.options || defaults,
					status: 'ok'
				})
			})
			break
			
		// Options - UPDATE
		case 'setOptions':
			chrome.storage.sync.set( {options: request.options}, function() {
				response({
					options: request.options,
					status: 'ok'
				})
			})
			break
		
		// !Done spotting
		case 'doneSpotting':
			
			// any users found?
			if( tabs[ 't'+ sender.tab.id ] && tabs[ 't'+ sender.tab.id ].users && Object.keys( tabs[ 't'+ sender.tab.id ].users ).length >= 1 ) {
				
				// !Display icon
				chrome.pageAction.show( sender.tab.id )
				
				// collect usernames for mass lookup (save API calls)
				var all_usernames = Object.keys( tabs[ 't'+ sender.tab.id ].users ).join(',')
				
				// fetch em, and replace when it is found
				fetch_bird( all_usernames, function( bird ) {
					tabs[ 't'+ sender.tab.id ].users[ bird.screen_name.toLowerCase() ] = bird
				})
			}
			
			response({ status: 'ok' })
			break
		
		// !Bird spotted
		case 'twitterUser':
			
			// !add to users
			var username = request.user.toLowerCase()
			if( tabs[ 't'+ sender.tab.id ].users[ username ] === undefined ) {
				tabs[ 't'+ sender.tab.id ].users[ username ] = {
					screen_name: username
				}
			}
			
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

// !Get API limit
function apiLimit( cb ) {
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {
		if( xhr.readyState == 4 && xhr.status == 200 ) {
			var data = xhr.responseText
			if( data.substr(0,1) == '{' && data.substr( data.length -1, 1 ) == '}' ) {
				data = JSON.parse( data )
				if( data.hourly_limit !== undefined ) {
					cb( data )
				}
			}
		}
	}
	xhr.open( 'GET', 'https://twitter.com/account/rate_limit_status.json', true )
	xhr.send()
}

// !Get user from Twitter API
function fetch_bird( usernames, cb ) {
	if( navigator.onLine ) {
		
		// !Fetcher: Browser online
		// commented lines are not used atm, saves memory
		http_request( usernames, function( bird ) {
			cb({
				screen_name:			bird.screen_name,
				id_str:				bird.id_str,
//				name:				bird.name,
//				location:			bird.location,
//				url:				bird.url,
				description:			bird.description,
//				protected:			bird.protected,
				followers_count:		bird.followers_count,
				followers_count_human:		human_number( bird.followers_count ),
//				friends_count:			bird.friends_count,
//				friends_count_human:		human_number( bird.friends_count ),
//				created_at:			bird.created_at,
//				utc_offset:			bird.utc_offset,
//				verified:			bird.verified,
//				statuses_count:			bird.statuses_count,
//				statuses_count_human:		human_number( bird.statuses_count ),
//				lang:				bird.lang,
				profile_image_url:		bird.profile_image_url || '',
				profile_image_url_https:	bird.profile_image_url_https,
//				following:			bird.following,
//				follow_request_sent:		bird.follow_request_sent
			})
		})
		
	} else {
		
		// !Fetcher: Browser offline
		usernames = usernames.split(',')
		for( var u in usernames ) {
			cb({ screen_name: usernames[u] })
		}
		
	}
}

// !HTTP REQUEST
function http_request( usernames, cb ) {
	var xhr = new XMLHttpRequest()
	
	xhr.onreadystatechange = function() {
		if( xhr.readyState == 4 ) {
			var data = xhr.responseText.trim()
			if( data.length >= 2 && data.match( /^(\{.*\}|\[.*\])$/ ) ) {
				data = JSON.parse( data )
				if( data && data[0] && data[0].screen_name ) {
					for( var t in data ) {
						cb( data[t] )
					}
				}
			}
		}
	}
	
	var protocol = prefs.https ? 'https:' : 'http:'
	var dnt = prefs.dnt ? '&dnt=true' : ''
	xhr.open( 'GET', protocol +'//api.twitter.com/1/users/lookup.json?screen_name='+ usernames +'&include_entities=false'+ dnt, true )
	xhr.send()
}

// !Human numbers
function human_number( number ) {
	var units = ['', 'K', 'M', 'G', 'T']
	var num = number
	var i = 0
	while( num >= 10000 ) {
		num = num / 1000
		i++
	}
	return Math.floor(num) + units[i]
}