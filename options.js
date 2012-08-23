var prefs = {}
var defaults = {
	avatars:	true,
	apilookup:	true,
	dnt:		true,
	https:		true,
	onclick:	0	// intent
}

function loadOptions() {
	chrome.storage.sync.get( 'options', function( res ) {
		prefs = res.options || defaults
		for( var id in prefs ) {
			itmValue( id, prefs[id] )
		}
	})
}

function saveOption() {
	prefs[ this.id ] = itmValue( this.id )
	chrome.storage.sync.set( {options: prefs}, function() {})
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
				itm.selectedIndex = value
			}
		} else {
			// GET value
			if( itm.type && itm.type == 'checkbox' ) {
				var value = itm.checked
			} else if( itm.tagName == 'SELECT' ) {
				var value = itm.selectedIndex
			}
		}
	}
	return value || null
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

chrome.storage.onChanged.addListener( function() {
	loadOptions()
})

// First load
loadOptions()
