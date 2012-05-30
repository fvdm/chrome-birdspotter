document.addEventListener( 'DOMContentLoaded', function () {
	console.log('hello');
	chrome.extension.sendRequest({ action: 'getUsers' }, function( response ) {
		for( var u in response.users ) {
			var user = response.users[u];
			document.getElementById('list').innerHTML = '<p>'+ user.username +'</p>';
		}
	});
});