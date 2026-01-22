// Shared navigation component for Cells app

(function() {
  const pages = [
    { href: 'index.html', label: 'Sandbox', section: 'explore' },
    { href: 'gallery.html', label: 'Gallery', section: 'explore' },
    { href: 'visualize.html', label: 'Visualize', section: 'explore' },
    { divider: true },
    { href: 'survey-gpu.html', label: 'Survey', section: 'research' },
    { href: 'analyze-pass2.html', label: 'Pass 2', section: 'research' },
    { href: 'test-measurements.html', label: 'Measurements', section: 'research' },
  ];

  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
  }

  function createNav() {
    const currentPage = getCurrentPage();

    const nav = document.createElement('nav');
    nav.className = 'site-nav';

    let html = `
      <a href="index.html" class="nav-brand">CELLS</a>
      <div class="nav-links">
    `;

    pages.forEach(page => {
      if (page.divider) {
        html += '<div class="nav-divider"></div>';
      } else {
        const isActive = currentPage === page.href;
        html += `<a href="${page.href}" class="nav-link${isActive ? ' active' : ''}">${page.label}</a>`;
      }
    });

    html += '</div>';
    nav.innerHTML = html;

    return nav;
  }

  function injectNav() {
    const nav = createNav();
    document.body.insertBefore(nav, document.body.firstChild);

    // Add padding to body for fixed nav
    document.body.style.paddingTop = '3.5rem';
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }
})();
