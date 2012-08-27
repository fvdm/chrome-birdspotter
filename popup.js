var prefs = {}

function buildUser( bird ) {
	console.log( bird )
	var li = document.createElement('li')
	li.setAttribute( 'data-username', bird.screen_name )
	li.onclick = openUser
	
	// avatar
	if( prefs.avatars ) {
		var avatar = document.createElement('img')
		if( bird.profile_image_url_https !== undefined ) {
			avatar.src = bird.profile_image_url_https + (prefs.dnt ? '?dnt=true' : '')
		} else {
			avatar.src = 'https://api.twitter.com/1/users/profile_image?screen_name='+ bird.screen_name +'&size=normal'+ (prefs.dnt ? '&dnt=true' : '')
		}
		li.appendChild( avatar )
	}
	
	// screen_name
	var name = document.createElement('div')
	name.className = 'name'
	name.innerHTML = bird.screen_name
	li.appendChild( name )
	
	// details
	if( prefs.apilookup && bird.description !== undefined ) {
		var info = document.createElement('div')
		info.className = 'info'
		info.innerHTML = bird.followers_count_human +' followers<br>'+ bird.description.substr(0,100)
		li.appendChild( info )
	}
	
	// add to list
	document.getElementById('list').appendChild( li )
}

// find current tab
chrome.tabs.query(
	{
		windowId:	chrome.windows.WINDOW_ID_CURRENT,
		active:		true
	},
	function( tabs ) {
		
		// found it
		var tab = tabs[0]
		
		// !Get options
		chrome.extension.sendRequest( {action: 'getOptions'}, function( res ) {
			prefs = res.options
			
			// !Get Twitter users from this tab
			chrome.extension.sendRequest(
				{
					action: 'getUsers',
					tabId:	tab.id
				},
				function( response ) {
					
					if( navigator.onLine ) {
						if( prefs.avatars && prefs.apilookup ) {
							var style = 'fancy'
						} else if( prefs.avatars && !prefs.apilookup ) {
							var style = 'easy'
						} else if( !prefs.avatars && prefs.apilookup ) {
							var style = 'boring'
						} else if( !prefs.avatars && !prefs.apilookup ) {
							var style = 'light'
						}
						
						document.getElementById('wrap').innerHTML = '<ul id="list" class="'+ style +'"></ul>'
						
					} else {
					
						// !Browser offline
						document.getElementById('wrap').innerHTML = '<div id="offline" title="User avatars and details are not available because your browser is offline.">browser offline</div><ul id="list" class="light"></ul>'
						
					}
					
					// !Iterate users
					for( var u in response.users ) {
						buildUser( response.users[u] )
					}
					
				}
			)
		})
	}
)

function openUser() {
	var dnt = prefs.dnt ? '&dnt=true' : ''
	
	switch( prefs.click ) {
		
		case 'intent':
			var left = parseInt( (screen.availWidth / 2) - 250 )
			var top = parseInt( (screen.availHeight / 2) - 184 )
			window.open( 'https://twitter.com/intent/user?screen_name='+ this.getAttribute('data-username') + dnt, 'twitterIntent', 'width=500,height=368,scrollbars=yes,resizable=no,toolbar=no,directories=no,location=no,menubar=no,status=no,screenX='+ left +',screenY='+ top )
			break
			
		case 'newtab':
			window.open( 'https://twitter.com/'+ this.getAttribute('data-username'), '_blank' )
			break
			
		case 'custom':
			var url = prefs.custom_url.replace( /\b\%([a-z])\b/, function( str, c ) {
				switch( c ) {
					case 'u': return this.getAttribute('data-username'); break
					case 'p': return prefs.https ? 'https:' : 'http:'; break
					default: return ''; break
				}
			})
			
			window.open( url, prefs.custom_target || '_blank' )
			break
			
		case 'nothing':
		default:
			break
	}
	
	return false
}
