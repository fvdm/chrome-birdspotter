var followersUnits = ['','K','M','B']

// find current tab
chrome.tabs.query(
	{
		windowId:	chrome.windows.WINDOW_ID_CURRENT,
		active:		true
	},
	function( tabs ) {
		
		// found it
		var tab = tabs[0]
		
		// get Twitter users from this tab
		chrome.extension.sendRequest(
			{
				action: 'getUsers',
				tabId:	tab.id
			},
			function( response ) {
				
				// let's build the popup
				for( var u in response.users ) {
					document.getElementById('list').innerHTML += '<li><div class="avatar"><img src="https://api.twitter.com/1/users/profile_image?screen_name='+ response.users[u].username +'&size=normal&dnt=true"></div><div class="name"><div class="screenname">@'+ response.users[u].username +'</div><div class="button"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/follow_button.html?screen_name='+ response.users[u].username +'&lang=en&dnt=true&show_count=true&show_screen_name=false" style="width:240px;height:20px;"></iframe></div></div></li>'
				}
				
			}
		)
	}
)