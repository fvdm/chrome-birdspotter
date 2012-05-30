var tabs = {};

// incoming request
chrome.extension.onRequest.addListener( function( request, sender, response ) {
	switch( request.action ) {
		
		// bird spotted
		case 'twitterUser':
			if( tabs[ 't'+ sender.tab.id ] === undefined ) {
				tabs[ 't'+ sender.tab.id ] = {
					users: {},
					amount: 0
				}
			}
			
			
			// update & display icon
			chrome.pageAction.setTitle({
				tabId:	sender.tab.id,
				title:	tabs[ sender.tab.id ].amount == 1 ? 'Found a Twitter user' : 'Found '+ tabs[ sender.tab.id ].amount +' Twitter users'
			});
			tabs[ 't'+ sender.tab.id ].users[ request.user.username ] = request.user;
			tabs[ 't'+ sender.tab.id ].amount++;
			
			chrome.pageAction.show( sender.tab.id );
			
			// all good
			response({ status: 'ok' });
			break;
		
		// popup wants something
		case 'getUsers':
			response( tabs[ 't'+ request.tabId ] );
			break;
		
	}
});