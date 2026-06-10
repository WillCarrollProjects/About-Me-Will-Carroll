// settings.js — injects the ⚙️ settings button + panel (theme toggle + account)
// into any page that includes it. Needs theme.js and the Supabase JS library.
(function () {
  var SB_BASE = "https://ebewnilkkambuxagccai.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZXduaWxra2FtYnV4YWdjY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjg5MTUsImV4cCI6MjA5NjYwNDkxNX0.hdCChehde6CFvdgRXl5GzucA55MsibziSFKwUBQlAXo";

  function build() {
    if (document.querySelector("#settings-btn")) return; // don't double-inject

    var btn = document.createElement("button");
    btn.id = "settings-btn";
    btn.title = "Settings";
    btn.textContent = "⚙️";

    var panel = document.createElement("div");
    panel.id = "settings-panel";
    panel.style.display = "none";
    panel.innerHTML =
      "<h3>Settings</h3>" +
      "<p>Theme</p>" +
      "<button id='theme-toggle'></button>" +
      "<hr style='border:none;border-top:1px solid var(--card-border);margin:16px 0;'>" +
      "<p>Account</p>" +
      "<div id='auth-area'></div>";

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // --- Theme toggle ---
    var themeToggle = panel.querySelector("#theme-toggle");
    function updateLabel() {
      var isLight = document.documentElement.classList.contains("light-theme");
      themeToggle.textContent = isLight ? "Switch to Dark (Letterboxd)" : "Switch to Light (Original)";
    }
    updateLabel();
    btn.addEventListener("click", function () {
      panel.style.display = (panel.style.display === "none") ? "block" : "none";
    });
    themeToggle.addEventListener("click", function () { toggleSiteTheme(); updateLabel(); });

    // --- Account (Supabase auth) ---
    var authArea = panel.querySelector("#auth-area");
    if (typeof supabase === "undefined") {
      authArea.innerHTML = "<a href='signin.html'><button>Sign in</button></a>";
      return;
    }
    var sb = supabase.createClient(SB_BASE, SB_KEY);
    function refreshAuth() {
      sb.auth.getUser().then(function (res) {
        var user = res.data && res.data.user;
        if (user) {
          var uname = (user.user_metadata && user.user_metadata.username) || user.email;
          authArea.innerHTML = "<p>Signed in as <strong></strong></p><button id='set-signout'>Sign out</button>";
          authArea.querySelector("strong").textContent = uname;
          authArea.querySelector("#set-signout").addEventListener("click", function () {
            sb.auth.signOut().then(refreshAuth);
          });
        } else {
          authArea.innerHTML = "<a href='signin.html'><button>Sign in</button></a>";
        }
      });
    }
    refreshAuth();
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
