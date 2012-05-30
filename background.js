var tabs = {};

// incoming request
chrome.extension.onRequest.addListener( function( request, sender, response ) {
	switch( request.action ) {
		
		// bird spotted
		case 'twitterUser':
			tabs[ sender.tab.id ] = {
				users: {},
				amount: 0
			}
			
			tabs[ sender.tab.id ].users[ request.user.username ] = request.user;
			tabs[ sender.tab.id ].amount++;
			
			chrome.pageAction.setTitle({
				tabId:	sender.tab.id,
				title:	tabs[ sender.tab.id ].amount == 1 ? 'Found a Twitter user' : 'Found '+ tabs[ sender.tab.id ].amount +' Twitter users'
			});
			
			chrome.pageAction.show( sender.tab.id );
			response({ status: 'ok' });
			break;
		
		// popup wants something
		case 'getUsers':
			console.log(sender);
			response( tabs[ sender.tab.id ] );
			break;
	}
});