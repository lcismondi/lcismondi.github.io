function loadHTML(selector, url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}`);
        }
        return response.text();
      })
      .then(data => {
        document.querySelector(selector).innerHTML = data;
      })
      .catch(error => console.error(error));
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    loadHTML('nav', 'nav.html');
    loadHTML('footer', 'footer.html');
  });

