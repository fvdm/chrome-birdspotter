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
					users: [],
					href: request.href
				}
			}
			
			// !add to users
			if( !inArray( request.user, tabs[ 't'+ sender.tab.id ].users ) ) {
				tabs[ 't'+ sender.tab.id ].users.push( request.user )
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

// !inArray
function inArray( needle, haystack ) {
	if( haystack.length && haystack.length >= 1 ) {
		for( var n in haystack ) {
			if( haystack[n] == needle ) {
				return true
			}
		}
	}
	return false
}