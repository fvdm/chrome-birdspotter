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
					
					// !init
					var li = document.createElement('li'),
					avatarDiv = document.createElement('div'),
					avatarLink = document.createElement('a'),
					avatarImage = document.createElement('img'),
					nameDiv = document.createElement('div'),
					screennameDiv = document.createElement('div'),
					screennameLink = document.createElement('a'),
					buttonDiv = document.createElement('div'),
					buttonIframe = document.createElement('iframe')
					
					// !avatar
					avatarImage.src = 'https://api.twitter.com/1/users/profile_image?screen_name='+ response.users[u].username +'&size=normal&dnt=true'
					avatarLink.target = '_blank'
					avatarLink.href = 'https://twitter.com/'+ response.users[u].username
					avatarLink.appendChild( avatarImage )
					avatarDiv.className = 'avatar'
					avatarDiv.appendChild( avatarLink )
										
					// !screenname
					screennameLink.target = '_blank'
					screennameLink.href = 'https://twitter.com/'+ response.users[u].username
					screennameLink.innerHTML = response.users[u].username
					screennameDiv.className = 'screenname'
					screennameDiv.appendChild( screennameLink )
					
					// !button
					buttonIframe.setAttribute( 'allowtransparency', true )
					buttonIframe.setAttribute( 'frameBorder', 0 )
					buttonIframe.setAttribute( 'scrolling', 'no' )
					buttonIframe.setAttribute( 'src', 'https://platform.twitter.com/widgets/follow_button.html?screen_name='+ response.users[u].username +'&lang=en&dnt=true&show_count=true&show_screen_name=false' )
					buttonIframe.style.width = '240px'
					buttonIframe.style.height = '20px'
					buttonDiv.className = 'button'
					buttonDiv.appendChild( buttonIframe )
					
					// !name
					nameDiv.className = 'name'
					nameDiv.appendChild( screennameDiv )
					nameDiv.appendChild( buttonDiv )
					
					// !list item
					li.appendChild( avatarDiv )
					li.appendChild( nameDiv )
					document.getElementById('list').appendChild( li )
					
				}
				
			}
		)
	}
)