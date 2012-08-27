var prefs = {}

function loadOptions() {
	chrome.extension.sendRequest( {action: 'getOptions'}, function( res ) {
		prefs = res.options
		for( var id in prefs ) {
			itmValue( id, prefs[id] )
		}
	})
}

function saveOption() {
	prefs[ this.id ] = itmValue( this.id )
	chrome.extension.sendRequest({
		action: 'setOptions',
		options: prefs
	})
}

// change item
function itmValue( id, value ) {
	var itm = document.getElementById( id )
	if( itm ) {
		if( value !== undefined ) {
			// SET value
			if( itm.type && itm.type == 'checkbox' ) {
				itm.checked = value
			} else if( itm.tagName == 'SELECT' ) {
				for( var o in itm.options ) {
					if( itm.options[o].value == value ) {
						itm.selectedIndex = o
					}
				}
			}
		} else {
			// GET value
			if( itm.type && itm.type == 'checkbox' ) {
				var value = itm.checked
			} else if( itm.tagName == 'SELECT' ) {
				var value = itm.options[ itm.selectedIndex ].value
			}
		}
	}
	return value || false
}

// watch for changes
var inputs = document.getElementsByTagName('input')
if( inputs.length >= 1 ) {
	for( var i in inputs ) {
		if( typeof inputs[i] == 'object' ) {
			inputs[i].addEventListener( 'change', saveOption )
		}
	}
}

var selects = document.getElementsByTagName('select')
if( selects.length >= 1 ) {
	for( var s in selects ) {
		if( typeof selects[s] == 'object' ) {
			selects[s].addEventListener( 'change', saveOption )
		}
	}
}

// First load
loadOptions()
chrome.extension.sendRequest( {action: 'apiLimit'}, function( res ) {
	document.getElementById('apilimit').innerHTML = res.limit.remaining_hits +' of '+ res.limit.hourly_limit +' <span class="note">(reset: '+ res.limit.reset_time +')</span>'
})
