
// Toggle Sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Toggle Theme
// Toggle Theme
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');

    // Alternar clase del tema
    body.classList.toggle('dark-mode');

    // Determinar estado actual y guardar en localStorage
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun'); // ☀️
    } else {
        icon.classList.replace('fa-sun', 'fa-moon'); // 🌙
    }
}

// Inicializar tema al cargar
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const icon = document.getElementById('theme-icon');

    let shouldBeDark = false;

    if (savedTheme) {
        // Si hay preferencia guardada, respetarla
        shouldBeDark = savedTheme === 'dark';
    } else {
        // Si no, usar lógica de hora (19:00 - 07:45)
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const startDark = 19 * 60; // 1140 min (19:00)
        const endDark = 7 * 60 + 45; // 465 min (07:45)

        // Es de noche si es >= 19:00 O < 07:45
        shouldBeDark = minutes >= startDark || minutes < endDark;
    }

    if (shouldBeDark) {
        body.classList.add('dark-mode');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Inicializar galería y lightbox al cargar
document.addEventListener("DOMContentLoaded", () => {
    const galleries = document.querySelectorAll(".gallery");
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");
    lightbox.innerHTML = `
        <button class="lightbox-close">✖</button>
        <button class="lightbox-btn prev">❮</button>
        <img src="" alt="Imagen ampliada">
        <button class="lightbox-btn next">❯</button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".prev");
    const nextBtn = lightbox.querySelector(".next");
    let currentIndex = 0;
    let currentGallery = [];

    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll("img");
        images.forEach((img, index) => {
            img.addEventListener("click", () => {
                currentGallery = Array.from(images);
                currentIndex = index;
                openLightbox(currentGallery[currentIndex].src);
            });
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        lightboxImg.src = currentGallery[currentIndex].src;
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        lightboxImg.src = currentGallery[currentIndex].src;
    });

    // Navegación con teclas
    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "Escape") closeLightbox();
    });
});

const navLinks = document.querySelectorAll('.nav-link');
const preview = document.getElementById('nav-preview');
const previewHeader = document.getElementById('preview-header');
const previewContentEl = document.getElementById('preview-content');
let hideTimeout;

navLinks.forEach(link => {
    link.addEventListener('mouseenter', function (e) {
        clearTimeout(hideTimeout);

        const sectionId = this.getAttribute('data-section');
        const linkText = this.querySelector('span:last-child') ? this.querySelector('span:last-child').textContent.trim() : '';
        const sectionIcon = this.querySelector('.nav-icon i') ? this.querySelector('.nav-icon i').className : 'fas fa-file';

        if (!sectionId) return;

        const section = document.getElementById(sectionId);
        if (!section) return;

        // Construir menú con títulos (h3/h4) de las cards
        const cards = Array.from(section.querySelectorAll('.card'));
        const menu = document.createElement('div');
        menu.className = 'preview-menu';
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.margin = '0';
        ul.style.padding = '0';

        cards.forEach((card, idx) => {
            const titleEl = card.querySelector('h3') || card.querySelector('h4') || card.querySelector('h2');
            const title = titleEl ? titleEl.textContent.trim() : `Elemento ${idx + 1}`;

            const li = document.createElement('li');
            li.className = 'preview-menu-item';
            li.textContent = title;
            li.style.padding = '10px 12px';
            li.style.cursor = 'pointer';
            li.style.borderRadius = '6px';
            li.style.marginBottom = '6px';
            li.style.fontFamily = 'inherit';
            li.style.color = 'inherit';
            li.style.fontSize = '0.95rem';
            li.style.fontWeight = '500';

            li.addEventListener('click', (ev) => {
                // Remover clase active de todos los items del menú
                document.querySelectorAll('.preview-menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Añadir clase active al item seleccionado
                li.classList.add('active');

                // Mostrar la sección y desplazar al elemento real
                showSection(sectionId, document.querySelector(`.nav-link[data-section="${sectionId}"]`));
                setTimeout(() => {
                    const targetCard = document.querySelector(`#${sectionId} .card:nth-of-type(${idx + 1})`);
                    if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 120);
                preview.classList.remove('active');
            });

            ul.appendChild(li);
        });

        // Estilizar y posicionar la previsualización al lado del enlace
        previewHeader.innerHTML = `<i class="${sectionIcon}"></i> ${linkText}`;
        previewContentEl.innerHTML = '';
        menu.appendChild(ul);
        previewContentEl.appendChild(menu);

        // Posicionar cerca del link (lado derecho)
        const rect = this.getBoundingClientRect();
        const left = Math.min(window.innerWidth - 320, rect.right + 8);
        const top = Math.max(8, rect.top - 6);
        preview.style.left = left + 'px';
        preview.style.top = top + 'px';
        preview.style.width = '320px';

        preview.classList.add('active');
    });

    link.addEventListener('mouseleave', function () {
        hideTimeout = setTimeout(() => { preview.classList.remove('active'); }, 220);
    });
});

// Mantener visible al pasar sobre la previsualización
preview.addEventListener('mouseenter', function () { clearTimeout(hideTimeout); });
preview.addEventListener('mouseleave', function () { preview.classList.remove('active'); });

function openModal(img) {
    modal.classList.add("show");
    modal.style.display = "flex"; // usa flex para centrar
    modalImg.src = img.src;
    captionText.textContent = img.alt || "";
}


document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('.diagram-container');

    containers.forEach(container => {
        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;

        // Cuando presionas el mouse sobre la imagen
        container.addEventListener('mousedown', (e) => {
            const img = container.querySelector('img');
            if (e.target.tagName === 'IMG' || container.contains(e.target)) {
                isDragging = true;
                startX = e.pageX;
                startY = e.pageY;
                scrollLeft = container.scrollLeft;
                scrollTop = container.scrollTop;
                container.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        // Cuando sueltas el mouse
        container.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        // Cuando el mouse sale del contenedor
        container.addEventListener('mouseleave', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        // Cuando mueves el mouse (arrastrando)
        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.pageX - startX;
            const deltaY = e.pageY - startY;

            container.scrollLeft = scrollLeft - deltaX;
            container.scrollTop = scrollTop - deltaY;
        });

        // Cambiar cursor cuando pasa sobre la imagen
        const img = container.querySelector('img');
        if (img) {
            img.addEventListener('mouseenter', () => {
                container.style.cursor = 'grab';
            });

            img.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    container.style.cursor = 'default';
                }
            });
        }
    });
});












// Sistema de zoom para diagramas
// Sistema de zoom para diagramas (CORREGIDO - centrado al 100%)
let zoomLevels = {};

function zoomDiagram(viewerId, factor) {
    const img = document.querySelector(`#${viewerId} img`);
    const container = document.querySelector(`#${viewerId} .diagram-container`);
    const zoomInfo = document.querySelector(`#${viewerId} .zoom-info`);

    if (!img || !container || !zoomInfo) return;

    if (!zoomLevels[viewerId]) zoomLevels[viewerId] = 1;

    // Calcular nuevo nivel de zoom
    zoomLevels[viewerId] *= factor;
    zoomLevels[viewerId] = Math.max(0.3, Math.min(zoomLevels[viewerId], 3));

    // Aplicar zoom
    img.style.transform = `scale(${zoomLevels[viewerId]})`;
    img.style.transformOrigin = 'center center';
    zoomInfo.textContent = Math.round(zoomLevels[viewerId] * 100) + '%';

    // Ajuste de padding para scroll
    const imgWidth = img.naturalWidth * zoomLevels[viewerId];
    const imgHeight = img.naturalHeight * zoomLevels[viewerId];
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (imgWidth > containerWidth || imgHeight > containerHeight) {
        const paddingX = Math.max(0, (imgWidth - containerWidth) / 2 + 50);
        const paddingY = Math.max(0, (imgHeight - containerHeight) / 2 + 50);
        container.style.padding = `${paddingY}px ${paddingX}px`;
    } else {
        container.style.padding = '20px';
    }
}

function resetDiagram(viewerId) {
    const img = document.querySelector(`#${viewerId} img`);
    const container = document.querySelector(`#${viewerId} .diagram-container`);
    const zoomInfo = document.querySelector(`#${viewerId} .zoom-info`);

    if (!img || !container || !zoomInfo) return;

    zoomLevels[viewerId] = 1;
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
    zoomInfo.textContent = '100%';
    container.style.padding = '20px';

    // Centrar la imagen
    setTimeout(() => {
        container.scrollLeft = (img.offsetWidth - container.clientWidth) / 2;
        container.scrollTop = (img.offsetHeight - container.clientHeight) / 2;
    }, 50);
}

function fitDiagram(viewerId) {
    const img = document.querySelector(`#${viewerId} img`);
    const container = document.querySelector(`#${viewerId} .diagram-container`);
    const zoomInfo = document.querySelector(`#${viewerId} .zoom-info`);

    if (!img || !container || !zoomInfo || !img.naturalWidth) return;

    // Resetear a 100% y centrar
    zoomLevels[viewerId] = 1;
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
    zoomInfo.textContent = '100%';
    container.style.padding = '20px';

    // Centrar la imagen
    setTimeout(() => {
        container.scrollLeft = (img.offsetWidth - container.clientWidth) / 2;
        container.scrollTop = (img.offsetHeight - container.clientHeight) / 2;
    }, 50);
}

// Inicializar todos los diagramas al 100% y centrados
function initializeDiagrams() {
    const viewers = [
        'viewer-contexto',
        'viewer-er',
        'viewer-estados',
        'viewer-poo',
        'viewer-casos-uso',
        'viewer-uml',
        'viewer-cun'
    ];

    viewers.forEach(viewerId => {
        const img = document.querySelector(`#${viewerId} img`);
        const container = document.querySelector(`#${viewerId} .diagram-container`);
        const zoomInfo = document.querySelector(`#${viewerId} .zoom-info`);

        if (img && container) {
            img.onload = function () {
                // Establecer zoom al 100%
                zoomLevels[viewerId] = 1;
                img.style.transform = 'scale(1)';
                img.style.transformOrigin = 'center center';
                if (zoomInfo) zoomInfo.textContent = '100%';
                container.style.padding = '20px';

                // Centrar la imagen después de cargar
                setTimeout(() => {
                    container.scrollLeft = (img.offsetWidth - container.clientWidth) / 2;
                    container.scrollTop = (img.offsetHeight - container.clientHeight) / 2;
                }, 100);
            };

            // Si la imagen ya está cargada
            if (img.complete) {
                img.onload();
            }
        }
    });
}

// Galería DFD con múltiples niveles
const DFD_IMAGES = [
    "img/diagramas/Analisis_Estructurado-Nivel0.drawio.png",
    "img/diagramas/Analisis_Estructurado-Nivel1.drawio.png",
    "img/diagramas/Analisis_Estructurado-Nivel2.drawio.png",
    "img/diagramas/Analisis_Estructurado-Nivel3.drawio.png"
];

let currentDFDIndex = 0;
let dfdZoom = 1;

function loadDFDImage() {
    const img = document.getElementById('dfd-gallery-img');
    const indexEl = document.getElementById('dfd-index');
    const container = document.getElementById('dfd-gallery-container');

    img.src = DFD_IMAGES[currentDFDIndex];
    indexEl.textContent = `${currentDFDIndex + 1}/${DFD_IMAGES.length}`;

    img.onload = () => {
        // Mostrar la imagen al 100% (sin escalar)
        resetDFDGallery();

        // Centrar horizontal y verticalmente la imagen al cargar
        requestAnimationFrame(() => {
            container.scrollLeft = (img.width - container.clientWidth) / 2;
            container.scrollTop = (img.height - container.clientHeight) / 2;
        });
    };
}


function nextDFD() {
    currentDFDIndex = (currentDFDIndex + 1) % DFD_IMAGES.length;
    loadDFDImage();
}

function prevDFD() {
    currentDFDIndex = (currentDFDIndex - 1 + DFD_IMAGES.length) % DFD_IMAGES.length;
    loadDFDImage();
}

function zoomDFDGallery(factor) {
    const img = document.getElementById('dfd-gallery-img');
    const container = document.getElementById('dfd-gallery-container');
    const zoomInfo = document.getElementById('dfd-zoom-info');

    dfdZoom *= factor;
    dfdZoom = Math.max(0.3, Math.min(dfdZoom, 3));

    img.style.transform = `scale(${dfdZoom})`;
    zoomInfo.textContent = Math.round(dfdZoom * 100) + '%';

    // Agregar padding para scroll completo
    const imgWidth = img.naturalWidth * dfdZoom;
    const imgHeight = img.naturalHeight * dfdZoom;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (imgWidth > containerWidth || imgHeight > containerHeight) {
        const paddingX = Math.max(0, (imgWidth - containerWidth) / 2 + 50);
        const paddingY = Math.max(0, (imgHeight - containerHeight) / 2 + 50);
        container.style.padding = `${paddingY}px ${paddingX}px`;
    } else {
        container.style.padding = '20px';
    }
}

function resetDFDGallery() {
    const img = document.getElementById('dfd-gallery-img');
    const container = document.getElementById('dfd-gallery-container');
    const zoomInfo = document.getElementById('dfd-zoom-info');

    dfdZoom = 1;
    img.style.transform = 'scale(1)';
    zoomInfo.textContent = '100%';
    container.style.padding = '20px';
    container.scrollLeft = 0;
    container.scrollTop = 0;
}

function fitDFDGallery() {
    const container = document.getElementById('dfd-gallery-container');
    const img = document.getElementById('dfd-gallery-img');
    const zoomInfo = document.getElementById('dfd-zoom-info');

    if (!img || !container || !img.naturalWidth) return;

    const containerWidth = container.clientWidth - 40;
    const imgWidth = img.naturalWidth;

    if (imgWidth > containerWidth) {
        const scale = containerWidth / imgWidth;
        dfdZoom = scale;
        img.style.transform = `scale(${scale})`;
        zoomInfo.textContent = Math.round(scale * 100) + '%';
        container.style.padding = '20px';
    } else {
        resetDFDGallery();
    }
}

// Atajos de teclado para la galería DFD
document.addEventListener('keydown', function (e) {
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection && activeSection.id === 'analisis-estructurado') {
        if (e.key === 'ArrowRight') nextDFD();
        else if (e.key === 'ArrowLeft') prevDFD();
        else if (e.key === '+' || e.key === '=') zoomDFDGallery(1.2);
        else if (e.key === '-') zoomDFDGallery(0.8);
        else if (e.key === '0') resetDFDGallery();
        else if (e.key.toLowerCase() === 'f') fitDFDGallery();
    }
});

// Cargar primera imagen al iniciar
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (document.getElementById('dfd-gallery-img')) {
            loadDFDImage();
        }
    }, 100);
});


// Reinicializar cuando cambies de sección
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }

    // Reinicializar diagramas de la sección actual
    setTimeout(() => {
        initializeDiagrams();
    }, 100);
}






// Toggle Navbar (ocultar/mostrar)
// Toggle Navbar (ocultar/mostrar)
function toggleNavbar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar && mainContent) {
        sidebar.classList.toggle('hidden');
        mainContent.classList.toggle('expanded');
    }
}







// Mostrar previsualización REAL de cada sección
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const preview = document.getElementById('nav-preview');
    const previewHeader = document.getElementById('preview-header');
    const previewContentEl = document.getElementById('preview-content');
    let hideTimeout;

    // Mapeo de secciones
    const sectionMap = {
        'inicio': 'inicio',
        'marco-teorico': 'marco-teorico',
        'analisis-estructurado': 'analisis-estructurado',
        'poo': 'poo',
        'video': 'video',
        'contactos': 'contactos'
    };

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function (e) {
            clearTimeout(hideTimeout);

            // Obtener identificador de sección desde data-section (si existe)
            const sectionId = this.getAttribute('data-section') || (this.querySelector('span:last-child') && this.querySelector('span:last-child').textContent.trim().toLowerCase());
            const linkText = this.querySelector('span:last-child') ? this.querySelector('span:last-child').textContent.trim() : '';
            const sectionIcon = this.querySelector('.nav-icon i') ? this.querySelector('.nav-icon i').className : 'fas fa-file';

            if (!sectionId) return;

            // (Se permite mostrar la previsualización aunque el enlace esté activo)

            const section = document.getElementById(sectionId);
            if (!section) return;

            // Generar menú con los elementos (tarjetas) principales de la sección
            const cards = Array.from(section.querySelectorAll('.card'));
            const menu = document.createElement('div');
            menu.className = 'preview-menu';
            const menuList = document.createElement('ul');
            menuList.style.listStyle = 'none';
            menuList.style.padding = '8px';
            menuList.style.margin = '0 0 10px 0';

            cards.forEach((card, idx) => {
                const titleEl = card.querySelector('h3') || card.querySelector('h4') || card.querySelector('h2');
                const title = titleEl ? titleEl.textContent.trim() : `Elemento ${idx + 1}`;

                const li = document.createElement('li');
                li.className = 'preview-menu-item';
                li.style.padding = '6px 10px';
                li.style.cursor = 'pointer';
                li.style.borderRadius = '6px';
                li.style.marginBottom = '6px';
                li.style.background = 'rgba(0,0,0,0.03)';
                li.textContent = title;

                li.addEventListener('click', (ev) => {
                    // Remover clase active de todos los items del menú
                    document.querySelectorAll('.preview-menu-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Añadir clase active al item seleccionado
                    li.classList.add('active');

                    // Al hacer click en el item del menú: mostrar la sección y desplazarse al elemento real
                    showSection(sectionId, document.querySelector(`.nav-link[data-section=\"${sectionId}\"]`));
                    setTimeout(() => {
                        const targetCard = document.querySelector(`#${sectionId} .card:nth-of-type(${idx + 1})`);
                        if (targetCard) {
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 120);

                    // Ocultar preview
                    preview.classList.remove('active');
                });

                menuList.appendChild(li);
            });

            // Encabezado de preview (solo menú, sin clon de la página)
            previewHeader.innerHTML = `<i class="${sectionIcon}"></i> ${linkText}`;

            // Limpiar e insertar solo el menú
            previewContentEl.innerHTML = '';
            menu.appendChild(menuList);
            previewContentEl.appendChild(menu);

            // Posicionar cerca del link (lado derecho)
            const rect2 = this.getBoundingClientRect();
            const left2 = Math.min(window.innerWidth - 320, rect2.right + 8);

            // Calcular altura real del menú para ajuste de bordes
            preview.style.display = 'block';
            preview.style.visibility = 'hidden';
            const menuHeight = preview.offsetHeight;
            preview.style.display = '';
            preview.style.visibility = '';

            let top2 = rect2.top - 6;

            // Si el menú se sale por abajo, ajustarlo hacia arriba
            if (top2 + menuHeight > window.innerHeight) {
                top2 = window.innerHeight - menuHeight - 10;
            }

            // Asegurar que no se salga por arriba
            top2 = Math.max(10, top2);

            preview.style.left = left2 + 'px';
            preview.style.top = top2 + 'px';
            preview.style.width = '320px';

            // Mostrar previsualización
            preview.classList.add('active');
        });

        link.addEventListener('mouseleave', function () {
            hideTimeout = setTimeout(() => {
                preview.classList.remove('active');
            }, 300);
        });
    });

    // Mantener visible al pasar sobre la previsualización
    preview.addEventListener('mouseenter', function () {
        clearTimeout(hideTimeout);
    });

    preview.addEventListener('mouseleave', function () {
        preview.classList.remove('active');
    });
});