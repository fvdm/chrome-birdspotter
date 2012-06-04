var tabs = {}

// incoming request
chrome.extension.onRequest.addListener( function( request, sender, response ) {
	switch( request.action ) {
		
		// bird spotted
		case 'twitterUser':
			
			// new tab, or tab changed URL
			if( tabs[ 't'+ sender.tab.id ] === undefined || tabs[ 't'+ sender.tab.id ].href != request.href ) {
				tabs[ 't'+ sender.tab.id ] = {
					users: {},
					amount: 0
				}
			}
			
			tabs[ 't'+ sender.tab.id ].users[ request.user.username ] = request.user
			tabs[ 't'+ sender.tab.id ].amount++
			tabs[ 't'+ sender.tab.id ].href = request.href
			
			// display icon
			chrome.pageAction.show( sender.tab.id )
			
			// all good
			response({ status: 'ok' })
			break;
		
		// popup wants something
		case 'getUsers':
			response( tabs[ 't'+ request.tabId ] )
			break;
		
	}
})