// script.js for project filtering, searching, and pagination

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const filterButtons = document.querySelectorAll('.filters button');
  const projectList = document.querySelectorAll('.project');
  const projectsPerPage = 6;
  let currentPage = 1;

  function filterProjects() {
    const query = searchBar.value.toLowerCase();
    const activeFilter = document.querySelector('.filters .active').dataset.filter;
    let visibleCount = 0;

    projectList.forEach((project, index) => {
      const tags = project.dataset.tags.split(',');
      const text = project.textContent.toLowerCase();
      const matchesTag = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesSearch = text.includes(query);

      if (matchesTag && matchesSearch) {
        project.style.display = 'block';
        visibleCount++;
      } else {
        project.style.display = 'none';
      }
    });

    paginateProjects();
  }

  function paginateProjects() {
    const visibleProjects = Array.from(projectList).filter(
      (proj) => proj.style.display === 'block'
    );

    visibleProjects.forEach((proj, index) => {
      const start = (currentPage - 1) * projectsPerPage;
      const end = start + projectsPerPage;
      proj.style.display = index >= start && index < end ? 'block' : 'none';
    });

    // TODO: Add pagination controls here
  }

  searchBar.addEventListener('input', () => {
    currentPage = 1;
    filterProjects();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      currentPage = 1;
      filterProjects();
    });
  });

  filterProjects();
});
