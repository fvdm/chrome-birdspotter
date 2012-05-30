// find current tab
chrome.tabs.query(
	{
		windowId:	chrome.windows.WINDOW_ID_CURRENT,
		active:		true
	},
	function( tabs ) {
		
		// found it
		var tab = tabs[0];
		
		// get Twitter users from this tab
		chrome.extension.sendRequest(
			{
				action: 'getUsers',
				tabId:	tab.id
			},
			function( response ) {
				
				// let's build the popup
				for( var u in response.users ) {
					var user = response.users[u];
					document.getElementById('list').innerHTML = '<p>'+ user.username +'</p>';
				}
				
			}
		);
	}
);