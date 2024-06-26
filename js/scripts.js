// Función para cargar contenido HTML en un selector específico
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
            initializeNavEvents(); // Inicializa los eventos después de cargar el contenido
        })
        .catch(error => console.error(error));
}

// Función para inicializar eventos en la navegación
function initializeNavEvents() {
    // Verifica que jQuery esté cargado y listo
    if (typeof $ === 'undefined') {
        console.error('jQuery is not loaded');
        return;
    }

    // Colapsa el nav
    $(document).ready(function () {
        //console.log('jQuery is loaded and ready.');

        // Verifica si estamos en la página de inicio
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {


            // Selecciona todos los enlaces dentro de la barra de navegación
            $('.navbar-nav a').on('click', function (e) {
                //console.log('Link clicked:', $(this).attr('href'));

                // Verifica si la barra de navegación está colapsada
                if ($('.navbar-collapse').hasClass('show')) {
                    console.log('Navbar is collapsed. Closing navbar.');
                    // Cierra la barra de navegación
                    $('.navbar-toggler').click();
                }
            });

        }

    });
}

// Ejecuta la carga del contenido dependiendo de la URL actual
document.addEventListener("DOMContentLoaded", function () {
    var currentUrl = window.location.pathname;

    if (currentUrl === '/' || currentUrl.endsWith('index.html')) {
        loadHTML('nav', 'nav.html');
        loadHTML('footer', 'footer.html');
    } else {
        loadHTML('nav', '../navproy.html');
        loadHTML('footer', '../footerproy.html');
    }
});

// Formulario de contacto
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");

    // Set the action attribute using JavaScript
    form.setAttribute("action", "https://docs.google.com/forms/d/e/1FAIpQLSc2L75SKm2em22xHlLLP6Gd9BmykjFGBHdlt0MHOuXBVYSctQ/formResponse");

    form.addEventListener("submit", function (event) {
        var honeypot = form.querySelector("input[name='honeypot']").value;
        if (honeypot) {
            // If the honeypot field is filled, it's a bot
            event.preventDefault();
            alert("Spam detected!");
            return false;
        }
        if (grecaptcha.getResponse() === "") {
            event.preventDefault();
            alert("Por favor, completa el reCAPTCHA.");
            return false;
        } else {
            document.getElementById("form").style.display = "none";  // make form invisible
            document.getElementById("completion-msg").style.display = "block"; // Optional if you want to give a completion feedback!
            return true;
        }
    });
});