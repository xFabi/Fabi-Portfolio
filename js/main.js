function createProjectTags(tags) {
  let tagsHtml = "";

  tags.forEach(function (tag) {
    tagsHtml += `<span>${tag}</span>`;
  });

  return tagsHtml;
}

function createProjectCard(project) {
  const tagsHtml = createProjectTags(project.tags);

  const card = `
    <article class="project-card">
      <div class="project-card-inner">
        <div class="project-card-face project-card-front">
          <div class="project-card-top">
            <p class="project-status">${project.status}</p>
            <span class="project-number">${project.number}</span>
          </div>

          <h3>${project.titel}</h3>
          <p>${project.description}</p>

          <div class="project-card-bottom">
            <div class="project-tags">
              ${tagsHtml}
            </div>

            <button class="project-arrow" type="button">→</button>
          </div>
        </div>

        <div class="project-card-face project-card-back">
          <div class="project-back-top">
            <p class="project-status">Beschreibung</p>
            <button class="project-arrow" type="button">←</button>
          </div>

          <div class="project-back-content">
            <h3>${project.backTitle}</h3>
            <p>${project.backText}</p>
          </div>
        </div>
      </div>
    </article>
  `;

  return card;
}

function loadProjects() {
  const projectGrid = document.querySelector("#project-grid");
  projectGrid.innerHTML = "";

  projekte.forEach(function (project) {
    projectGrid.innerHTML += createProjectCard(project);
  });
}

function setupProjectCards() {
  const projectButtons = document.querySelectorAll(".project-arrow");

  projectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const projectCard = button.closest(".project-card");
      projectCard.classList.toggle("is-flipped");
    });
  });
}

loadProjects();
setupProjectCards();
