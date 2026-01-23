// Shared navigation component for Cells app

(function() {
  const pages = [
    { href: 'home.html', label: 'Home', section: 'main' },
    { href: 'atlas.html', label: 'Atlas', section: 'main' },
    { href: 'detail.html', label: 'Detail', section: 'main' },
    { divider: true },
    { href: 'survey-gpu.html', label: 'Lab', section: 'research' },
    { href: 'analyze-pass2.html', label: 'Analysis', section: 'research' },
    { divider: true },
    { href: 'migrate-csv.html', label: 'Data', section: 'tools' },
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
      <a href="home.html" class="nav-brand">CELLS</a>
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

    html += `
      </div>
      <div class="nav-db-status" id="nav-db-status" title="Click to refresh">
        <span class="db-icon">◉</span>
        <span class="db-count">--</span>
      </div>
    `;
    nav.innerHTML = html;

    return nav;
  }

  async function updateDbStatus() {
    const statusEl = document.getElementById('nav-db-status');
    if (!statusEl) return;

    // Check if CellsDB is available
    if (typeof CellsDB === 'undefined') {
      statusEl.querySelector('.db-count').textContent = 'no db';
      statusEl.classList.add('db-offline');
      return;
    }

    try {
      const stats = await CellsDB.getStats();
      statusEl.querySelector('.db-count').textContent = `${stats.count.toLocaleString()} rules`;
      statusEl.classList.remove('db-offline');
      statusEl.classList.add('db-online');
      statusEl.title = `${stats.display}\nClick to refresh`;
    } catch (e) {
      statusEl.querySelector('.db-count').textContent = 'error';
      statusEl.classList.add('db-offline');
    }
  }

  function injectNav() {
    const nav = createNav();
    document.body.insertBefore(nav, document.body.firstChild);

    // Add padding to body for fixed nav
    document.body.style.paddingTop = '3.5rem';

    // Add click handler for db status refresh
    const statusEl = document.getElementById('nav-db-status');
    if (statusEl) {
      statusEl.addEventListener('click', updateDbStatus);
    }

    // Update db status after a short delay (let Dexie load)
    setTimeout(updateDbStatus, 500);
  }

  // Expose updateDbStatus globally for other scripts to call
  window.updateNavDbStatus = updateDbStatus;

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }
})();
