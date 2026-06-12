// theme.js — remembers the site theme and applies it on every page.
// Default is "dark" (the Letterboxd look). "light" is the original look.
// This runs immediately (it's loaded in <head>) so there's no flash of the
// wrong theme before the page shows.
(function () {
  var saved = null;
  try { saved = localStorage.getItem("siteTheme"); } catch (e) {}
  if (saved === "light") {
    document.documentElement.classList.add("light-theme");
  }
})();

// Flip the theme and remember the choice. Returns true if it's now light.
function toggleSiteTheme() {
  var isLight = document.documentElement.classList.toggle("light-theme");
  try { localStorage.setItem("siteTheme", isLight ? "light" : "dark"); } catch (e) {}
  return isLight;
}

// --- Page backgrounds ---
// The movie arcade page gets a faded poster wall (real posters from TMDB,
// dimmed by an overlay). Every other page gets soft colorful glows.
(function () {
  var onArcade = /moviegame\.html$/i.test(location.pathname);
  var POSTERS = "/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg,/kJAJNNBYlbqAcpTDxBNnaILSMTy.jpg,/vmlJvz6qVzYgei2V74GvnmcuQfW.jpg,/4TpBhdaSl5ALHbgeaYOLF8Q3haz.jpg,/hwRdDFIhaEmpRgoki805YvyyjZf.jpg,/zm0KAbOjlt9eR5y7vDiL2dEOwMl.jpg,/5Vi8dSauVwH1HOsiZceDMbRr1Ca.jpg,/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg,/3YMd9Ogae4rDKLWuAZFuse9xhc5.jpg,/1q308iixueCU4pFtSYugNOevtNx.jpg,/4KZXlZ5tTT6ghbW77gS4hSLkCd7.jpg,/1HRUTqEVDmJC4L6tp6zd85MI6uH.jpg,/7wIBfBl2gejt6xHxNSK0reVIm7E.jpg,/uIrFdMWlJFdc1jPBP9bxeaISCDj.jpg,/nEuEMJrnLBneE9tJlmzbhCFLu95.jpg,/dQgIcW6Th08kMRf2HBoYWoFE6OD.jpg,/qQclTgLMDvGBuUBFGHRipxkEwWR.jpg,/yihdXomYb5kTeSivtFndMy5iDmf.jpg,/tHhxWxge06goXU6ZQH1hj7vK8Hd.jpg,/dpQIeEunpgj0C4rngb6OFb4zSd1.jpg,/ov8vrRLZGoXHpYjSY9Vpv1tHJX7.jpg,/8ehYxUh5MWE41AeE9gkHE8DKzvB.jpg,/cHKo3m8N1fwvEy2ZEr0xGmmMODV.jpg,/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg,/jKPWwsbAM6HKURPYQ1eG8DmKMKn.jpg,/3TrQUHmnEL2tOYf4KKkXb01BQt2.jpg,/3o5YPjDGDTcTDL5ftDA9NwN9dLd.jpg,/reZ8NInXjMkkaOpUHcI3Pn7iaRN.jpg,/aElHyIdF5jmctFGhlhhaPFsbBJC.jpg,/gV0J0Fqw2mYMtQbzb0ruxv9MAeZ.jpg,/alf3JOPP7EYP0iO24gwe5YfRnqo.jpg,/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg,/xjtWQ2CL1mpmMNwuU5HeS4Iuwuu.jpg,/3BjLdTWRiHc1ISIZMFvToOmghOM.jpg,/pXENxAzOBrTSDJGxDcUnlNTNmWr.jpg,/xIZ8huVdXCL7OMtsjd3XvmFP5sK.jpg,/uJOW6pWxJ0i5sji9VXRR6Y1wXyE.jpg,/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg,/8Cw8GF9wG63kF8pRRXwOx2kXGt.jpg,/kZCauMzAt9eMAhLMopCqnFw1Q5k.jpg,/fVQFPRuw3yWXojYDJvA5EoFjUOY.jpg,/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg,/ybrX94xQm8lXYpZAPRmwD9iIbWP.jpg,/qJGVLxMO11CmLLSxtEO055limUr.jpg,/32xWlHXSCywvHuy20ElcbAbnpRg.jpg,/eTp7gSPkSF3Aw79mNx1NkBP1PZT.jpg,/8912AsVuS7Sj915apArUFbv6F9L.jpg,/zNfqugt7ZPFpWeXAQsF5IqDCDft.jpg".split(",");

  function buildGlow() {
    if (document.getElementById("glow-bg")) return;
    var glow = document.createElement("div");
    glow.id = "glow-bg";
    glow.setAttribute("aria-hidden", "true");
    document.body.prepend(glow);
  }

  // Shuffle an array in place (Fisher–Yates).
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // Lay enough posters to cover any screen; the grid wraps and crops the rest.
  function fillWall(wall, paths) {
    wall.innerHTML = "";
    var count = Math.max(96, paths.length);
    for (var i = 0; i < count; i++) {
      var img = document.createElement("img");
      img.src = "https://image.tmdb.org/t/p/w185" + paths[i % paths.length];
      img.alt = "";
      img.loading = "lazy";
      wall.appendChild(img);
    }
  }

  function buildWall() {
    if (document.getElementById("poster-bg")) return;

    var wall = document.createElement("div");
    wall.id = "poster-bg";
    wall.setAttribute("aria-hidden", "true");
    var overlay = document.createElement("div");
    overlay.id = "poster-bg-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.prepend(overlay);
    document.body.prepend(wall);

    // A different random set of movies every visit: pull two random pages of
    // popular films from TMDB. (Game-to-game switches inside the arcade never
    // reload the page, so the wall stays put while you play.)
    var TMDB_KEY = "c2b14e76ecfe4135ea4d7e3d66966097";
    var page1 = 1 + Math.floor(Math.random() * 30);
    var page2 = (page1 % 30) + 1; // a guaranteed-different second page
    function popular(page) {
      return fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + TMDB_KEY + "&page=" + page)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          return (d.results || []).map(function (m) { return m.poster_path; }).filter(Boolean);
        });
    }
    Promise.all([popular(page1), popular(page2)])
      .then(function (lists) {
        var paths = lists[0].concat(lists[1]);
        fillWall(wall, shuffle(paths.length >= 20 ? paths : POSTERS.slice()));
      })
      .catch(function () {
        // TMDB unreachable — fall back to the built-in list, still shuffled.
        fillWall(wall, shuffle(POSTERS.slice()));
      });
  }

  function buildBackground() {
    // The arcade page is detected by its URL, or by its unique menu element.
    if (onArcade || document.getElementById("mode-screen")) buildWall();
    else buildGlow();
  }

  if (document.body) buildBackground();
  else document.addEventListener("DOMContentLoaded", buildBackground);
})();
