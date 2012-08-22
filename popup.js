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
						infoDiv = document.createElement('div'),
						screennameDiv = document.createElement('div'),
						detailsDiv = document.createElement('div')
						
						avatarImage.src = bird.profile_image_url_https +'?dnt=true'
						avatarDiv.className = 'avatar'
						avatarDiv.appendChild( avatarImage )
											
						screennameDiv.className = 'screenname'
						screennameDiv.innerHTML = bird.screen_name
						
						detailsDiv.className = 'details'
						detailsDiv.innerHTML = bird.followers_count_human +' followers<br>'+ bird.description.substr(0,100)
						
						infoDiv.className = 'info'
						infoDiv.appendChild( screennameDiv )
						infoDiv.appendChild( detailsDiv )
						
						li.className = 'itemOnline'
						li.setAttribute( 'data-username', bird.screen_name )
						li.onclick = displayIntent
						li.appendChild( avatarDiv )
						li.appendChild( infoDiv )
						
						document.getElementById('list').appendChild( li )
						
					}
					
				} else {
					
					// !Browser offline
					document.getElementById('wrap').innerHTML = '<div id="offline" title="User avatars and details are not available because your browser is offline.">browser offline</div><ul id="list"></ul>'
					for( var u in response.users ) {
						
						var bird = response.users[u],
						li = document.createElement('li'),
						screennameLink = document.createElement('a')
						
						screennameLink.target = '_blank'
						screennameLink.href = 'https://twitter.com/'+ bird.screen_name
						screennameLink.className = 'screenname'
						screennameLink.innerHTML = bird.screen_name
						
						li.className = 'itemOffline'
						li.appendChild( screennameLink )
						document.getElementById('list').appendChild( li )
					}
					
				}
				
			}
		)
	}
)

function displayIntent() {
	var left = parseInt( (screen.availWidth / 2) - 250 )
	var top = parseInt( (screen.availHeight / 2) - 184 )
	window.open( 'https://twitter.com/intent/user?screen_name='+ this.getAttribute('data-username') +'&dnt=true', 'twitterIntent', 'width=500,height=368,scrollbars=yes,resizable=no,toolbar=no,directories=no,location=no,menubar=no,status=no,screenX='+ left +',screenY='+ top )
	return false
}
