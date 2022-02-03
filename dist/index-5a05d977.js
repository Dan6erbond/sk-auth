'use strict';

var providers_base = require('./providers/base.js');
var providers_github = require('./providers/github.js');
var providers_google = require('./providers/google.js');
var providers_facebook = require('./providers/facebook.js');
var providers_oauth2_base = require('./providers/oauth2.base.js');
var providers_oauth2 = require('./providers/oauth2.js');
var providers_reddit = require('./providers/reddit.js');
var providers_spotify = require('./providers/spotify.js');
var providers_twitch = require('./providers/twitch.js');
var providers_twitter = require('./providers/twitter.js');

var index = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Provider: providers_base.Provider,
	GitHubOAuth2Provider: providers_github.GitHubOAuth2Provider,
	GoogleOAuth2Provider: providers_google.GoogleOAuth2Provider,
	FacebookOAuth2Provider: providers_facebook.FacebookOAuth2Provider,
	OAuth2BaseProvider: providers_oauth2_base.OAuth2BaseProvider,
	OAuth2Provider: providers_oauth2.OAuth2Provider,
	RedditOAuth2Provider: providers_reddit.RedditOAuth2Provider,
	SpotifyOAuth2Provider: providers_spotify.SpotifyOAuth2Provider,
	TwitchOAuth2Provider: providers_twitch.TwitchOAuth2Provider,
	TwitterAuthProvider: providers_twitter.TwitterAuthProvider
});

exports.index = index;
//# sourceMappingURL=index-5a05d977.js.map
