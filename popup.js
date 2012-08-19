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
						link = document.createElement('a'),
						avatarDiv = document.createElement('div'),
						avatarImage = document.createElement('img'),
						nameDiv = document.createElement('div'),
						screennameDiv = document.createElement('div'),
						detailsDiv = document.createElement('div')
						
						avatarImage.src = bird.profile_image_url_https +'?dnt=true'
						avatarDiv.className = 'avatar'
						avatarDiv.appendChild( avatarImage )
											
						screennameDiv.className = 'screenname'
						screennameDiv.innerHTML = bird.screen_name
						
						detailsDiv.className = 'details'
						detailsDiv.innerHTML = bird.followers_count_human +' followers<br>'+ bird.description.substr(0,100)
						
						nameDiv.className = 'name'
						nameDiv.appendChild( screennameDiv )
						nameDiv.appendChild( detailsDiv )
						
						link.href = 'https://twitter.com/'+ bird.screen_name
						link.target = '_blank'
						link.appendChild( avatarDiv )
						link.appendChild( nameDiv )
						
						li.className = 'itemOnline'
						li.appendChild( link )
						
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