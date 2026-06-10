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
