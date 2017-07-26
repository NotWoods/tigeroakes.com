/*
 * Copyright 2011 Roman Nurik
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {

var TWITTER_SCREEN_NAME = '';
var FRIENDFEED_USERNAME = '';
var GPLUS_PROFILE_ID = '115313576249285169465';
var GOOGLE_API_KEY = 'AIzaSyDK_ePhFso2qvJHoN7ZeZgtZ26Ntd_-qpM';

// TODO: remove this check
if (GOOGLE_API_KEY == '__INSERT_YOUR_API_KEY_HERE__') {
  alert('Don\'t forget to add a Google+ API key! ' +
        '(see http://code.google.com/apis/console)');
}

$(document).ready(reloadStream);

function reloadStream() {
  if (reloadStream._loading)
    return;
  reloadStream._loading = true;
  $('#stream').empty();
  $('<div class="loading">').appendTo('body');

  var loadedSources = {
    friendfeed: false,
    twitter: false,
    plus: false
  };

  var allEntries = [];

  var _makeLoadCallback = function(source) {
    return function(entries) {
      loadedSources[source] = true;
      allEntries = allEntries.concat(entries);

      var allSourcesLoaded = true;
      for (var s in loadedSources) {
        if (!loadedSources[s]) {
          allSourcesLoaded = false;
          break;
        }
      }
      if (allSourcesLoaded && reloadStream._loading) {
        reloadStream._loading = false;
        rebuildStreamUI(allEntries);
      }
    };
  };

  loadFriendfeed(_makeLoadCallback('friendfeed'));
  loadTwitter(_makeLoadCallback('twitter'));
  loadPlus(_makeLoadCallback('plus'));
  //loadFake(_makeLoadCallback('plus'));
  //loadFake(_makeLoadCallback('twitter'));

  window.setTimeout(function() {
    // prevent rebuildStreamUI from being called
    if (!reloadStream._loading) {
      return;
    }
    reloadStream._loading = false;

    // If some sources are loaded, just show what's available
    var someSourcesLoaded = false;
    for (var s in loadedSources) {
      if (loadedSources[s]) {
        someSourcesLoaded = true;
        break;
      }
    }
    if (someSourcesLoaded) {
      rebuildStreamUI(allEntries);
    } else {
      $('.loading').remove();
      $('<p>')
          .text('The stream is currently down.')
          .appendTo('#stream');
      // request.abort doesn't work for JSONP
    }
  }, 10000);
}

function loadFake(callback) {
  callback([]);
}

function loadTwitter(callback) {
  $.ajax({
    url: 'http://api.twitter.com/1/statuses/user_timeline.json',
    data: {
      screen_name: TWITTER_SCREEN_NAME,
      exclude_replies: 'true',
      include_rts: 'true',
      trim_user: 'true',
      include_entities: 'true',
      count: 40
    },
    dataType: 'jsonp',
    success: function(tweets, textStatus, xhr) {
      var entries = [];
      for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];

        // Normalize tweet to a FriendFeed-like entry.

        var entry = {
          via: {
            name: 'Twitter',
            url: 'http://twitter.com/' + TWITTER_SCREEN_NAME +
                '/status/' + tweet.id_str
          },
          body: htmlifyTweetText(tweet.text, tweet.entities || []),
          //http://stackoverflow.com/questions/2611415
          date: new Date(tweet.created_at.replace(
              /^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
              '$1 $2 $4 $3 UTC')),
          retweets: tweet.retweet_count
        };

        entries.push(entry);
      }

      callback(entries);
    }
    /* error: doesn't work for JSONP requests */
  });
}

function htmlifyTweetText(text, entities) {
  // Mark up tweet.text using tweet.entities. Wouldn't it be nice if the
  // Twitter API just produced HTML? :-)

  // First create a single, character index-sorted list of entities
  var sortedEntities = [];
  for (var entityType in entities) {
    if (!(entityType in htmlifyTweetText._entityTypes)) {
      continue;
    }
    for (var i = 0; i < entities[entityType].length; i++) {
      entities[entityType][i].entityType =
          htmlifyTweetText._entityTypes[entityType];
      sortedEntities.push(entities[entityType][i]);
    }
  }
  sortedEntities.sort(function(x,y){ return x.indices[0] - y.indices[0]; });

  // Build up the HTML from the tweet text and sorted entities.
  var html = [];
  var pos = 0; // current position in text
  for (var i = 0; i < sortedEntities.length; i++) {
    var entity = sortedEntities[i];
    html.push(text.substr(pos, entity.indices[0] - pos));
    switch (entity.entityType) {
      case htmlifyTweetText._TYPE_MENTION:
        entityHtml = '<a href="http://twitter.com/' + entity.screen_name +
            '">@' + entity.screen_name + '</a>';
        break;

      case htmlifyTweetText._TYPE_HASHTAG:
        entityHtml = '<a href="http://twitter.com/search/%23' + entity.text +
            '">#' + entity.text + '</a>';
        break;

      case htmlifyTweetText._TYPE_URL:
        entityHtml = '<a href="' + entity.url + '">' +
            entity.display_url + '</a>';
        break;
    }
    html.push(entityHtml);
    pos = entity.indices[1];
  }
  html.push(text.substr(pos));

  return html.join('');
}
htmlifyTweetText._TYPE_MENTION = 1;
htmlifyTweetText._TYPE_HASHTAG = 2;
htmlifyTweetText._TYPE_URL = 3;
htmlifyTweetText._entityTypes = {
  'user_mentions': htmlifyTweetText._TYPE_MENTION,
  'hashtags': htmlifyTweetText._TYPE_HASHTAG,
  'urls': htmlifyTweetText._TYPE_URL
};

function loadPlus(callback) {
  $.ajax({
    url: 'https://www.googleapis.com/plus/v1/people/' +
        GPLUS_PROFILE_ID + '/activities/public',
    data: {
      key: GOOGLE_API_KEY
    },
    dataType: 'jsonp',
    success: function(response, textStatus, xhr) {
      if (response.error) {
        callback([]);
        if (console && console.error) {
          console.error('Error loading Google+ stream.', response.error);
        }
        return;
      }
      var entries = [];
      for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        var object = item.object || {};

        // Normalize tweet to a FriendFeed-like entry.

        var html = [item.title];
        html.push(' <b><a href="' + item.url + '">Read post &raquo;</a>');

        var thumbnails = [];

        var attachments = object.attachments || [];
        for (var j = 0; j < attachments.length; j++) {
          var attachment = attachments[j];
          switch (attachment.objectType) {
            case 'photo':
              thumbnails.push({
                url: attachment.image.url,
                link: attachment.fullImage.url
              });
              break;

            case 'video':
              thumbnails.push({
                url: attachment.image.url,
                link: attachment.url
              });
              break;

            case 'article':
              html.push('<div class="link-attachment"><a href="' +
                  attachment.url + '">' + attachment.displayName + '</a>');
              if (attachment.content) {
                html.push('<br>' + attachment.content + '');
              }
              html.push('</div>');
              break;
          }
        }

        html = html.join('');

        var entry = {
          via: {
            name: 'Google+',
            url: item.url
          },
          body: html,
          date: parseRfc3339Date(item.updated),
          reshares: (object.resharers || {}).totalItems,
          plusones: (object.plusoners || {}).totalItems,
          comments: (object.replies || {}).totalItems,
          thumbnails: thumbnails
        };

        entries.push(entry);
      }

      callback(entries);
    }
    /* error: doesn't work for JSONP requests */
  });
}

function loadFriendfeed(callback) {
  $.ajax({
    url: 'http://friendfeed-api.com/v2/feed/' + FRIENDFEED_USERNAME,
    dataType: 'jsonp',
    success: function(response, textStatus, xhr) {
      for (var i = 0; i < response.entries.length; i++) {
        var entry = response.entries[i];

        entry.date = parseRfc3339Date(entry.date);

        if (!entry.via) {
          entry.via = {
            name: 'FriendFeed',
            url: entry.url
          };
        }
      }

      callback(response.entries);
    }
    //error: doesn't work for JSONP requests
  });
}

// To be called once we have stream data
function rebuildStreamUI(entries) {
  entries = entries || [];
  entries.sort(function(x,y){ return y.date - x.date; });
  $('.loading').remove();

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var $entry = $('<li>')
        .addClass(entry.via.name)
        .html(entry.body)

    // Entry icon
    var urlDomain = parseUrl(entry.via.url).domain;
    var faviconUrl = (urlDomain.match(/plus\.google/))
        ? 'a/plus-favicon.png'
        : ('http://www.google.com/s2/favicons?domain=' +
              parseUrl(entry.via.url).domain);
    $('<img class="icon">')
        .attr('src', faviconUrl)
        .appendTo($entry);

    // Thumbnails
    if (entry.thumbnails && entry.thumbnails.length) {
      var $thumbs = $('<ul class="thumbnails">').appendTo($entry);
      for (var j = 0; j < entry.thumbnails.length; j++) {
        var thumb = entry.thumbnails[j];
        var $thumb = $('<li>').appendTo($thumbs);
        if (thumb.link)
          $thumb = $('<a>')
              .attr('href', thumb.link)
              .appendTo($thumb);
        $('<img>')
            .attr({
              src: thumb.url/*,
              width: thumb.width,
              height: thumb.height*/
            })
            .appendTo($thumb);
      }
    }

    // Meta (date/time, via link)
    var $meta = $('<div class="meta">').appendTo($entry);
    $('<span class="from">')
        .html('<a href="' + entry.via.url + '">' +
              humanizeTimeDelta(entry.date - new Date()) +
              '</a> from ' + entry.via.name)
        .appendTo($meta);

    if (entry.plusones) {
      $('<span class="small-numeric-meta">')
          .text('+' + entry.plusones)
          .appendTo($meta);
    }
    if (entry.reshares) {
      $('<span class="small-numeric-meta">')
          .text(entry.reshares + ' reshare' +
              ((entry.reshares == 1) ? '' : 's'))
          .appendTo($meta);
    }
    if (entry.retweets) {
      $('<span class="small-numeric-meta">')
          .text(entry.retweets + ' retweet' +
              ((entry.retweets == 1) ? '' : 's'))
          .appendTo($meta);
    }
    if (entry.comments) {
      $('<span class="small-numeric-meta">')
          .text(entry.comments + ' comment' +
              ((entry.comments == 1) ? '' : 's'))
          .appendTo($meta);
    }

    $entry.appendTo('#stream');
  }
}

function parseRfc3339Date(dateStr) {
  var match = parseRfc3339Date._RFC_3339_DATE_RE.exec(dateStr || '');
  if (!match)
    return null;

  var d = {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
    hour: parseInt(match[4], 10),
    minute: parseInt(match[5], 10),
    second: parseInt(match[6] || 0, 10),
    tz: {
      exists: !!(match[7] || match[8]),
      Z: match[7],
      hrs: parseInt(match[8] || 0, 10),
      mins: parseInt(match[9] || 0, 10)
    }
  };

  var date = new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second);

  if (d.tz.exists) {
    var numericDate = date.getTime();
    numericDate -= date.getTimezoneOffset() * 60000;
    if (d.tz.hrs)
      numericDate += (d.tz.hrs * 60 + d.tz.mins) * 60000;

    date = new Date(numericDate);
  }
  window.foo = d;
  return date;
}
parseRfc3339Date._RFC_3339_DATE_RE = new RegExp(
    '^(\\d{4})-(\\d{2})-(\\d{2})' + // date
    'T(\\d{2})\\:(\\d{2})' + // hours, minutes
    '(?:\\:(\\d{2}(?:\\.\\d+)?))?' + // seconds, milliseconds
    '(?:(Z)|([+-]\\d{2})(\\d{2}))?' + // timezone
    '$', 'i');

function humanizeTimeDelta(d) {
  if (!humanizeTimeDelta._plural) {
    humanizeTimeDelta._plural = function(n, round, sing, unit) {
      var fn = round ? 'round' : 'floor';
      return ((Math[fn](n) == 1) ? sing + ' ' + unit
                                 : Math[fn](n) + ' ' + unit + 's');
    };
  }

  d = Math.abs(d);
  if (d < 1000)
    return 'under a second ago';
  if ((d /= 1000) < 60)
    return humanizeTimeDelta._plural(d, false, 'a', 'second') + ' ago';
  if ((d /= 60) < 60)
    return humanizeTimeDelta._plural(d, false, 'a', 'minute') + ' ago';
  if ((d /= 60) < 24)
    return humanizeTimeDelta._plural(d, false, 'an', 'hour') + ' ago';
  if ((d /= 24) < 7)
    return humanizeTimeDelta._plural(d, false, 'a', 'day') + ' ago';
  if (d < 30)
    return humanizeTimeDelta._plural(d / 7, true, 'a', 'week') + ' ago';
  if (d < 365)
    return humanizeTimeDelta._plural(d / 30, true, 'a', 'month') + ' ago';
  if ((d /= 365) < 10)
    return humanizeTimeDelta._plural(d, true, 'a', 'year') + ' ago';

  return 'a long, long time ago';
}
window.humanizeTimeDelta = humanizeTimeDelta;

function parseUrl(url) {
  var match = parseUrl._URL_RE.exec(url || '');
  if (!match)
    return null;

  return {
    scheme: match[1],
    domain: match[2],
    port: match[3] ? parseInt(match[3], 10) : null,
    path: match[4] || null,
    query: match[5] || null,
    hash: match[6] || null
  };
}
parseUrl._URL_RE = new RegExp(
    '^(\\w+\\:(?://)?)' + // scheme
    '([\\w.]+)(?:\\:(\\d+))?' + // domain + port
    '(/[^?#]*)?' + // path
    '(?:\\?([^#]*))?' + // query
    '(?:#(.*))?' + // hash
    '$', 'i');

})();
