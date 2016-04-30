var prefs = {};

function loadOptions () {
  chrome.extension.sendRequest ({ action: 'getOptions' }, function (res) {
    prefs = res.options;
    if (Object.keys (prefs) .length) {
      for (var id in prefs) {
        itmValue (id, prefs [id]);
      }
    }
  });
}

function saveOption () {
  prefs [this.id] = itmValue (this.id);
  chrome.extension.sendRequest ({
    action: 'setOptions',
    options: prefs
  });
}

// change item
function itmValue (id, value) {
  var itm = document.getElementById (id);
  if (itm) {
    if (value !== undefined) {
      // SET value
      if (itm.type && itm.type === 'checkbox') {
        itm.checked = value;
      } else if (itm.tagName === 'SELECT') {
        for (var o in itm.options) {
          if (itm.options [o] .value === value) {
            itm.selectedIndex = o;
          }
        }
      } else if (itm.type && itm.type === 'text') {
        itm.value = value;
      }
    } else {
      // GET value
      if (itm.type && itm.type === 'checkbox') {
        value = itm.checked;
      } else if (itm.tagName === 'SELECT') {
        value = itm.options [itm.selectedIndex] .value;
      } else if (itm.type && itm.type === 'text') {
        value = itm.value;
      }
    }
  }
  return value || false;
}

// watch for changes
function watchTagChanges (tag) {
  var tags = document.getElementsByTagName (tag);
  var i;

  if (tags.length) {
    for (i in tags) {
      if (typeof tags [i] === 'object') {
        tags [i] .addEventListener ('change', saveOption);
      }
    }
  }
}

watchTagChanges ('input');
watchTagChanges ('select');

// First load
loadOptions ();
