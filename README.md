BirdSpotter
===========

*Chrome extension to auto discover Twitter users in webpages.*

Let Chrome find Twitter users to follow on any website or blog. No more scanning through bloated webpages to find that @followme link.

When Bird Spotter finds a Twitter user it will notify you with the little bird in your omnibar. Simply click the bird to see the usernames it found and choose whom to follow.

* [Installation](#installation)
* [Detection](#detection)
* [Privacy](#privacy)
* [Future](#future)

# Installation

Either install from the Chrome Webstore, this is always the latest stable release with automatic updates.

**[Bird Spotter in the Chrome Webstore](https://chrome.google.com/webstore/detail/ggnolfdnhcpnjipfjbicfjifmodbckok)**

Or from Github:

```
git clone https://github.com/fvdm/BirdSpotter
```

And then go to [your extensions](chrome://chrome/extensions/), enable `Developer mode` (checkbox top-right), click `Load unpacked extension` to install from source and browse to the BirdSpotter folder.

# Detection

The content_script is injected into each webpage and executed when the tab is idle. Usually when all page HTML, rendering and scripts are complete. Then it uses native browser features to do the detection. Parsing the DOM is avoided as much as possible.

1. First the script iterates `document.links` to find basic Twitter links.
2. Then iterate `document.scripts` to find Twitter widgets and API calls in the `script.src`. (not the scripts themselves!)
3. Then iterate `document.head.children` to find `publisher:twitter` metatags, used often on Tumblr.

Each time a username is found it is send to the `background.js` script which removes non-usernames, doubles and maintains a store for the results on each unchanged tab. The background script is most important as it allows communication between the `content_script` and `popup.js`.

# Privacy

Your privacy is protected as much as possible. The `popup.js` loads user avatars and follow buttons from Twitter, but always via HTTPS with `&dnt=true` hardcoded in the URLs to enable Twitter's Do-Not-Track implementation.

As the popup.js runs in its own sandbox, and is the only part that actually calls out to Twitter, they will never have access to your tabs. However, the Follow buttons will read your Twitter.com cookies to find if you are already following the user.

No tracking or analytics scripts are included anywhere in the code.

# Future

Later on I'd like to add these features to Bird Spotter:

* Preferences:
  * show/hide follow buttons
  * show/hide follower counts
  * show/hide avatars
* OAuth, allows more background processing to speed up the popup (no more slow widgets)