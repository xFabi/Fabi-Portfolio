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
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach(function (projectCard) {
    projectCard.addEventListener("click", function () {
      projectCards.forEach(function (card) {
        if (card !== projectCard) {
          card.classList.remove("is-flipped");
        }
      });

      projectCard.classList.toggle("is-flipped");
    });
  });
}

function setupGlowButtons() {
  const glowButtons = document.querySelectorAll(".glow-button");

  glowButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const glowColor = button.dataset.glow;

      document.documentElement.style.setProperty("--glow-color", glowColor);

      glowButtons.forEach(function (glowButton) {
        glowButton.classList.remove("is-active");
      });

      button.classList.add("is-active");
    });
  });
}

function setupScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top-button");

  if (!scrollTopButton) {
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollTopButton.classList.add("is-visible");
    } else {
      scrollTopButton.classList.remove("is-visible");
    }
  });

  scrollTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setupActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    let activeLink = navLinks[0];
    let smallestDistance = window.innerHeight;

    navLinks.forEach(function (link) {
      const sectionId = link.getAttribute("href");
      const section = document.querySelector(sectionId);

      if (!section) {
        return;
      }

      const sectionPosition = section.getBoundingClientRect();
      const distanceFromTop = Math.abs(sectionPosition.top - 120);

      if (distanceFromTop < smallestDistance) {
        smallestDistance = distanceFromTop;
        activeLink = link;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
      activeLink = navLinks[navLinks.length - 1];
    }

    if (activeLink) {
      activeLink.classList.add("is-active");
    }
  }

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink();
}

function setupPageMouseGlow() {
  document.addEventListener("mousemove", function (event) {
    const mouseX = event.clientX / window.innerWidth - 0.5;
    const mouseY = event.clientY / window.innerHeight - 0.5;
    const gridShiftX = mouseX * 18;
    const gridShiftY = mouseY * 18;

    document.documentElement.style.setProperty("--grid-shift-x", gridShiftX + "px");
    document.documentElement.style.setProperty("--grid-shift-y", gridShiftY + "px");
  });
}

function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);

  if (!section) {
    return;
  }

  section.scrollIntoView({
    behavior: "smooth",
  });
}

function closeLoadingScreen() {
  const loadingScreen = document.querySelector("#loading-screen");

  if (!loadingScreen) {
    return;
  }

  loadingScreen.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}

function setupTerminalCommands() {
  const loadingOutput = document.querySelector("#loading-output");
  const terminalForm = document.querySelector("#terminal-command");
  const terminalInput = document.querySelector("#terminal-input");

  if (!loadingOutput || !terminalForm || !terminalInput) {
    return;
  }

  terminalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const command = terminalInput.value.trim().toLowerCase();
    terminalInput.value = "";

    loadingOutput.innerHTML += `
      <div class="terminal-line">fabi.dev &gt; ${command}</div>
    `;

    if (command === "help") {
      loadingOutput.innerHTML += `
        <div class="terminal-line">Befehle: home, projects, about, contact, start</div>
      `;
    } else if (command === "home") {
      closeLoadingScreen();
      scrollToSection("#home");
    } else if (command === "projects") {
      closeLoadingScreen();
      scrollToSection("#projects");
    } else if (command === "about") {
      closeLoadingScreen();
      scrollToSection("#about");
    } else if (command === "contact") {
      closeLoadingScreen();
      scrollToSection("#contact");
    } else if (command === "start") {
      closeLoadingScreen();
    } else {
      loadingOutput.innerHTML += `
        <div class="terminal-line">Unbekannter Befehl. Tippe help.</div>
      `;
    }
  });
}

function startLoadingScreen() {
  const loadingScreen = document.querySelector("#loading-screen");
  const loadingOutput = document.querySelector("#loading-output");
  const terminalForm = document.querySelector("#terminal-command");
  const terminalInput = document.querySelector("#terminal-input");

  if (!loadingScreen || !loadingOutput || !terminalForm || !terminalInput) {
    return;
  }

  document.body.classList.add("is-loading");

  const loadingLines = [
    "> Lade Portfolio...",
    "> JavaScript aktiv",
    `> Projekte gefunden: ${projekte.length}`,
    "> Willkommen bei Fabi.Dev",
  ];

  let lineIndex = 0;

  function writeNextLine() {
    if (lineIndex >= loadingLines.length) {
      loadingOutput.innerHTML += `
        <div class="terminal-line">Tippe help und drücke Enter.</div>
        <span class="terminal-cursor"></span>
      `;

      terminalForm.classList.add("is-visible");
      terminalInput.focus();

      return;
    }

    loadingOutput.innerHTML += `
      <div class="terminal-line">${loadingLines[lineIndex]}</div>
    `;

    lineIndex++;
    setTimeout(writeNextLine, 550);
  }

  writeNextLine();
}

loadProjects();
setupProjectCards();
setupGlowButtons();
setupScrollTopButton();
setupActiveNavLinks();
setupPageMouseGlow();
setupTerminalCommands();
startLoadingScreen();
