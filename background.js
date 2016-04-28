// !Storage
var tabs = {};
var prefs = {};
var defaults = {
  onTwitter: false,
  click: 'intent', // intent, tab, custom, nothing
  customURL: ''
};

// !Incoming request
chrome.extension.onRequest.addListener (function (request, sender, response) {

  // !new tab, or tab changed URL
  var tabId = request.tabId || sender.tabId || null;
  var tabUrl = null;

  if( sender && sender.tab ) {
    var tabId = sender.tab.id;
    var tabUrl = sender.tab.url;
  } else if( request && request.tab ) {
    var tabId = request.tab.id;
    var tabUrl = request.tab.url;
  }

  if (tabs ['t'+ tabId] === undefined || tabs ['t'+ tabId] .href != tabUrl) {
    tabs ['t'+ tabId] = {
      users: {},
      href: tabUrl
    };
  }

  switch (request.action) {

    // !Options - GET
    case 'getOptions':
      loadOptions (function (options) {
        response ({
          options: options,
          status: 'ok'
        });
      });
      break;

    // !Options - UPDATE
    case 'setOptions':
      chrome.storage.sync.set ({ options: request.options }, function () {
        response ({
          options: request.options,
          status: 'ok'
        });
      });
      break;

    // !Done spotting
    case 'doneSpotting':

      // any users found?
      if (tabs ['t'+ tabId] && tabs ['t'+ tabId] .users && Object.keys (tabs ['t'+ tabId] .users).length >= 1) {

        // !Display icon
        chrome.pageAction.show (tabId);
      }

      response ({ status: 'ok' });
      break;

    // !Bird spotted
    case 'twitterUser':

      // !add to users
      var username = request.user.toLowerCase ();
      tabs ['t'+ tabId] .users [username] = username;

      response ({ status: 'ok' });
      break

    // !Popup wants something
    case 'getUsers':
      if (tabs ['t'+ tabId]) {
        response (tabs ['t'+ tabId]);
      }
      break;
  }
});

// !Tab closed
chrome.tabs.onRemoved.addListener (function (tabId, removeInfo) {
  if (tabs ['t'+ tabId] !== undefined) {
    delete tabs ['t'+ tabId];
  }
});

// !Load options
function loadOptions (cb) {
  chrome.storage.sync.get ('options', function (res) {
    prefs = res.options || defaults;
    if (typeof cb === 'function') {
      cb (prefs);
    }
  });
}

chrome.storage.onChanged.addListener (function (ch, ns) {
  loadOptions ();
});

// first load
loadOptions ();
