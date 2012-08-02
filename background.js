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
					amount: 0
				}
			}
			
			tabs[ 't'+ sender.tab.id ].users[ request.user.username.toLowerCase() ] = request.user
			tabs[ 't'+ sender.tab.id ].amount++
			tabs[ 't'+ sender.tab.id ].href = request.href
			
			// !display icon
			chrome.pageAction.show( sender.tab.id )
			
			// !all good
			response({ status: 'ok' })
			break
		
		// !Popup wants something
		case 'getUsers':
			response( tabs[ 't'+ request.tabId ] )
			break
		
	}
})

// !Tab closed
chrome.tabs.onRemoved.addListener( function( tabId, removeInfo ) {
	if( tabs[ 't'+ tabId ] !== undefined ) {
		delete tabs[ 't'+ tabId ]
	}
})
