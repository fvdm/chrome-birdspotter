var prefs = {};

function buildUser (screen_name) {
  var li = document.createElement ('li');
  li.setAttribute ('data-username', screen_name);
  li.onclick = openUser;

  // screen_name
  var name = document.createElement ('div');
  name.className = 'name';
  name.innerHTML = screen_name;
  li.appendChild (name);

  // add to list
  document.getElementById ('list') .appendChild (li);
}

// find current tab
chrome.tabs.query (
  {
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    active:   true
  },
  function (tabs) {

    // found it
    var tab = tabs [0];

    // !Get options
    chrome.extension.sendRequest ({ action: 'getOptions', tab: tab }, function (res) {
      prefs = res.options;

      // !Get Twitter users from this tab
      chrome.extension.sendRequest (
        {
          action: 'getUsers',
          tab:  tab
        },
        function (response) {
          var style = 'light';
          document.getElementById ('wrap') .innerHTML = '<ul id="list" class="'+ style +'"></ul>';

          // !Iterate users
          for (var screen_name in response.users) {
            buildUser (screen_name);
          }
        }
      );
    });
  }
);

function openUser () {
  switch (prefs.click) {

    case 'intent':
      var left = parseInt ((screen.availWidth / 2) - 250);
      var top = parseInt ((screen.availHeight / 2) - 184);
      window.open ('https://twitter.com/intent/user?screen_name='+ this.getAttribute ('data-username'), 'twitterIntent', 'width=500,height=368,scrollbars=yes,resizable=no,toolbar=no,directories=no,location=no,menubar=no,status=no,screenX='+ left +',screenY='+ top);
      break;

    case 'newtab':
      window.open ('https://twitter.com/'+ this.getAttribute ('data-username'), '_blank');
      break;

    case 'custom':
      var url = prefs.customURL.replace ('{user}', this.getAttribute ('data-username'));
      if (!url.match (/^(http|https|ftp|file):/)) {
        var el = document.getElementById ('appLoader');
        el.src = url;
      } else {
        window.open (url);
      }
      break;

    case 'nothing':
    default:
      break;
  }
  return false;
}
