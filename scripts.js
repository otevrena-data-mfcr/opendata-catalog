$(document).ready(function () {

  $(".copy").click(function () {

    var text;

    if ($(this).data("copy")) {
      text = $(this).data("copy");
    }
    else if ($(this).parents(".script").length) {
      text = $(this).parent().find("pre").text();
    }

    copyTextToClipboard(text);

    $(this).addClass("copied");

  });

  function assignAnimatedScroll(target) {
    $(target).on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("href"));
      var scrollTarget = $(this).data("scroll-target") ? $($(this).data("scroll-target")) : undefined;
      if (scrollTarget) {
        var offset = target.offset().top - scrollTarget.offset().top + scrollTarget.scrollTop() - 50;
        scrollTarget.animate({ scrollTop: offset }, '250ms');
      }
      else {
        console.log(target.offset().top);
        $([document.documentElement, document.body]).animate({ scrollTop: target.offset().top }, '250ms');
      }
    });
  }
  $("a[href*=\\#]").each(function () {
    assignAnimatedScroll(this);
  })

  var tocLastId = 0;

  $(".autotoc").each(function () {
    var toc = this;
    var targetId = $(this).data("target");
    var levels = $(this).data("levels") || "h1,h2";

    var tocLinkTemplate = $("<a/>");

    if ($(this).data("scroll-target")) tocLinkTemplate.data("scroll-target", $(this).data("scroll-target"));

    var tocItems = $(targetId).find(levels).toArray();
    tocItems.sort(function (a, b) { return $(a).offset().top - $(b).offset().top; });

    tocItems.forEach(function (tocItem) {
      var id = $(tocItem).attr("id");
      if (!id) {
        tocLastId++;
        id = "toc_" + tocLastId;
        $(tocItem).attr("id", id);
      }
      var tocLink = tocLinkTemplate.clone(true).text($(tocItem).text()).attr("href", "#" + id);
      assignAnimatedScroll(tocLink);
      $(toc).append(tocLink);
    })

  });

  $(".download-card").each(function () {
    var url = $(this).data("url");
    var card = $(this);

    getHeaders(url, function (headers) {
      card.find(".size").text(prettyBytes(Number(headers["content-length"])));
      card.find(".date").text(headers["last-modified"]);
      card.find(".etag").text(headers["etag"]);
      card.find(".type").text(headers["content-type"]);
    });
  });

  $(".dataset").each(function () {

    var self = $(this);
    var iri = self.data("iri");
    if (!iri) return;

    self.find(".title").text("Načítání...");

    $.get(iri)
      .then(function (data) {
        self.find(".title").text(data.název.cs);
        self.find(".description").text(data.popis.cs);
      })
      .catch(function (err) {

      })
  });


});

function getGatewayUrl(url) {
  return "https://opendata.mfcr.cz/gateway/" + url.replace("//", "/");
  //return url;
}

function getHeaders(url, callback) {
  $.ajax({
    url: getGatewayUrl(url),
    method: "HEAD",
    async: true,
    cache: false
  }).done(function (message, text, jqXHR) {
    callback({
      "accept-ranges": jqXHR.getResponseHeader('Accept-Ranges'),
      "content-length": jqXHR.getResponseHeader('Content-Length'),
      "last-modified": jqXHR.getResponseHeader('Last-Modified'),
      "content-type": jqXHR.getResponseHeader('Content-Type'),
      "etag": jqXHR.getResponseHeader('ETag')
    });
  });

}

function downloadJSON(url, callback) {
  $.get({
    url: getGatewayUrl(url),
    method: "GET",
    dataType: "json"
  }).then(callback);
}

function downloadPartialData(url, start, size, callback) {
  $.get({
    url: getGatewayUrl(url),
    method: "GET",
    headers: {
      "Range": `bytes=${start}-${size}`
    },
    dataType: "text"
  }).then(callback);
}

function downloadPartialBinary(url, start, size, callback) {
  var xhrOverride = new XMLHttpRequest();
  xhrOverride.responseType = 'arraybuffer';
  $.get({
    url: getGatewayUrl(url),
    method: "GET",
    headers: {
      "Range": `bytes=${start}-${size}`
    },
    xhr: function () {
      return xhrOverride;
    }
  }).then(callback);
}


// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function prettyBytes(size) {
  if (size > 1024 * 1024 * 1024) return Math.round(size / (1024 * 1024 * 1024) * 100) / 100 + " GB";
  if (size > 1024 * 1024) return Math.round(size / (1024 * 1024) * 100) / 100 + " MB";
  if (size > 1024) return Math.round(size / (1024) * 100) / 100 + " kB";
  return size + " B";
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!');
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
}