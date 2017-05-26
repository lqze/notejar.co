// Author: Caleb Fetzer, March 2017.
// lazy javascript, needs revision.
// Hacky and works, since just two navigation elements.
// This code just toggles the active highlight on the navigation
// bar.

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.href.indexOf("about") != -1) {
    document.getElementById('liabout').classList.add("active");
    document.getElementById('lihome').classList.toggle("active");
  } else if (window.location.href.indexOf("2") != -1) {
    document.getElementById('lihome').classList.remove("active");
    document.getElementById('liabout').classList.remove("active");
  }
});
