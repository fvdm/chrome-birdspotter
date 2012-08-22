var prefs = {}

// save a pref
function savePref() {
	prefs[ this.name ] = this.checked
	chrome.storage.sync.set( {options: prefs}, function() {
		// saved
	})
}

// load prefs
function loadPrefs() {
	chrome.storage.sync.get( 'options', function( options ) {
		prefs = options.options || {}
		for( var name in prefs ) {
			var value = prefs[name]
			var itm = document.getElementById('pref'+ name)
			if( itm.type == 'checkbox' ) {
				itm.checked = value
			} else if( itm.tagName == 'SELECT' ) {
				itm.value = value
			}
		}
	})
}

// first time
//chrome.storage.sync.clear()
loadPrefs()

// prefs update somewhere else
chrome.storage.onChanged.addListener( function( changes, ns ) {
	for( var name in changes.oldValue ) {
		if( changes.newValue[ name ] === undefined ) {
			delete prefs[ name ]
		} else {
			prefs[ name ] = changes.newValue[ name ]
		}
	}
})

// user changed something
var inputs = document.getElementsByTagName('input')
for( var i in inputs ) {
	if( typeof inputs[i] == 'object' ) {
		inputs[i].addEventListener( 'change', savePref )
	}
}

var selects = document.getElementsByTagName('select')
for( var i in selects ) {
	if( typeof selects[i] == 'object' ) {
		selects[i].addEventListener( 'change', savePref )
	}
}
