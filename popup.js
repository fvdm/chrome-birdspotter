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
				
				if( navigator.onLine ) {
					
					// !Browser online
					document.getElementById('wrap').innerHTML = '<ul id="list"></ul>'
					for( var u in response.users ) {
						
						var user = response.users[u].username,
						li = document.createElement('li'),
						avatarDiv = document.createElement('div'),
						avatarLink = document.createElement('a'),
						avatarImage = document.createElement('img'),
						nameDiv = document.createElement('div'),
						screennameDiv = document.createElement('div'),
						screennameLink = document.createElement('a'),
						buttonDiv = document.createElement('div'),
						buttonIframe = document.createElement('iframe')
						
						avatarImage.src = 'https://api.twitter.com/1/users/profile_image?screen_name='+ user +'&size=normal&dnt=true'
						avatarLink.target = '_blank'
						avatarLink.href = 'https://twitter.com/'+ user
						avatarLink.appendChild( avatarImage )
						avatarDiv.className = 'avatar'
						avatarDiv.appendChild( avatarLink )
											
						screennameLink.target = '_blank'
						screennameLink.href = 'https://twitter.com/'+ user
						screennameLink.innerHTML = user
						screennameDiv.className = 'screenname'
						screennameDiv.appendChild( screennameLink )
						
						buttonIframe.setAttribute( 'allowtransparency', true )
						buttonIframe.setAttribute( 'frameBorder', 0 )
						buttonIframe.setAttribute( 'scrolling', 'no' )
						buttonIframe.setAttribute( 'src', 'https://platform.twitter.com/widgets/follow_button.html?screen_name='+ user +'&lang=en&dnt=true&show_count=true&show_screen_name=false' )
						buttonDiv.className = 'button'
						buttonDiv.appendChild( buttonIframe )
						
						nameDiv.className = 'name'
						nameDiv.appendChild( screennameDiv )
						nameDiv.appendChild( buttonDiv )
						
						li.className = 'itemOnline'
						li.appendChild( avatarDiv )
						li.appendChild( nameDiv )
						document.getElementById('list').appendChild( li )
						
					}
					
				} else {
					
					// !Browser offline
					document.getElementById('wrap').innerHTML = '<div id="offline" title="User avatars and follow buttons are not visible because your browser is offline.">browser offline</div><ul id="list"></ul>'
					for( var u in response.users ) {
						
						var user = response.users[u].username,
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