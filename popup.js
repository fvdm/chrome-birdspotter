// find current tab
chrome.tabs.query(
	{
		windowId:	chrome.windows.WINDOW_ID_CURRENT,
		active:		true
	},
	function( tabs ) {
		
		// found it
		var tab = tabs[0]
		
		// !Get Twitter users from this tab
		chrome.extension.sendRequest(
			{
				action: 'getUsers',
				tabId:	tab.id
			},
			function( response ) {
				
				// !Check network
				if( navigator.onLine ) {
					
					// !Browser online
					document.getElementById('wrap').innerHTML = '<ul id="list"></ul>'
					for( var u in response.users ) {
						
						var bird = response.users[u],
						li = document.createElement('li'),
						avatarDiv = document.createElement('div'),
						avatarLink = document.createElement('a'),
						avatarImage = document.createElement('img'),
						nameDiv = document.createElement('div'),
						screennameDiv = document.createElement('div'),
						screennameLink = document.createElement('a')
						
						avatarImage.src = bird.profile_image_url_https
						avatarLink.target = '_blank'
						avatarLink.href = 'https://twitter.com/'+ bird.screen_name
						avatarLink.appendChild( avatarImage )
						avatarDiv.className = 'avatar'
						avatarDiv.appendChild( avatarLink )
											
						screennameLink.target = '_blank'
						screennameLink.href = 'https://twitter.com/'+ bird.screen_name
						screennameLink.innerHTML = bird.screen_name
						screennameDiv.className = 'screenname'
						screennameDiv.appendChild( screennameLink )
						
						nameDiv.className = 'name'
						nameDiv.appendChild( screennameDiv )
						
						li.className = 'itemOnline'
						li.appendChild( avatarDiv )
						li.appendChild( nameDiv )
						document.getElementById('list').appendChild( li )
						
					}
					
				} else {
					
					// !Browser offline
					document.getElementById('wrap').innerHTML = '<div id="offline" title="User avatars and follow buttons are not visible because your browser is offline.">browser offline</div><ul id="list"></ul>'
					for( var u in response.users ) {
						
						var user = response.users[u],
						li = document.createElement('li'),
						screennameLink = document.createElement('a')
						
						screennameLink.target = '_blank'
						screennameLink.href = 'https://twitter.com/'+ user
						screennameLink.className = 'screenname'
						screennameLink.innerHTML = user
						
						li.className = 'itemOffline'
						li.appendChild( screennameLink )
						document.getElementById('list').appendChild( li )
					}
					
				}
				
			}
		)
	}
)