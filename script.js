// script.js for loading + filtering projects with search and pagination

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const filterButtons = document.querySelectorAll('.filters button');
  const projectContainer = document.getElementById('project-list');
  const projectsPerPage = 6;
  let currentPage = 1;
  let allProjects = [];

  // Step 1: Load JSON data and create cards
  async function loadProjects() {
    try {
      const res = await fetch('https://raw.githubusercontent.com/jrm328/thejoeproject-info/gh-pages/assets/projects.json');
      allProjects = await res.json();
      renderProjects();
    } catch (error) {
      projectContainer.innerHTML = `<p>Error loading projects. Please try again later.</p>`;
      console.error('Failed to load project data:', error);
    }
  }

  // Step 2: Render filtered + paginated project cards
  function renderProjects() {
    const query = searchBar.value.toLowerCase();
    const activeFilter = document.querySelector('.filters .active')?.dataset.filter || 'all';

    const filtered = allProjects.filter(project => {
      const matchesTag = activeFilter === 'all' || project.tags.includes(activeFilter);
      const matchesSearch = project.title.toLowerCase().includes(query) || project.summary.toLowerCase().includes(query);
      return matchesTag && matchesSearch;
    });

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const paginated = filtered.slice(start, end);

    projectContainer.innerHTML = paginated.map(project => `
      <div class="project-card" data-tags="${project.tags.join(',')}">
        <img src="${project.thumbnail}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <a href="${project.url}" target="_blank">Read More</a>
      </div>
    `).join('');

    renderPagination(filtered.length);
  }

  // Step 3: Render pagination buttons
  function renderPagination(totalItems) {
    const pageCount = Math.ceil(totalItems / projectsPerPage);
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.classList.toggle('active', i === currentPage);
      btn.addEventListener('click', () => {
        currentPage = i;
        renderProjects();
      });
      pagination.appendChild(btn);
    }
  }

  // Event listeners
  searchBar.addEventListener('input', () => {
    currentPage = 1;
    renderProjects();
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentPage = 1;
      renderProjects();
    });
  });

  // Kick things off
  loadProjects();
});
