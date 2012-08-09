BirdSpotter
===========

Chrome extension to auto discover Twitter users in webpages.

* [Installation](#installation)
* [Detection](#detection)

# Installation

Either install from the Chrome Webstore, this is always the latest stable release with automatic updates.

**[Bird Spotter in the Chrome Webstore](https://chrome.google.com/webstore/detail/ggnolfdnhcpnjipfjbicfjifmodbckok)**

Or from Github:

```
git clone https://github.com/fvdm/BirdSpotter
```

And then go to your extensions, click Advanced, the install from source and browse to the BirdSpotter folder.

# Detection

The content_script is injected into each webpage and executed when the tab is idle. Usually when all page HTML, redering and scripts are complete. Then it uses native browser features to do the detection. Parsing the DOM is avoided as much as possible.

1. First the script iterates `document.links` to find basic Twitter links.
2. Then iterate `document.scripts` to find Twitter widgets and API calls in the `script.src`. (not the scripts themselves!)
3. Then iterate document.metaTags to find `publisher:twitter`, used often on Tumblr.

Each time a username is found it is send to the `background.js` script which removes non-usernames, doubles and maintains a store for the results on each unchanged tab. The background script is most important as it allows communication between the `content_script` and `popup.js`.
