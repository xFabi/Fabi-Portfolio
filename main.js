function setupProjectCards() {
  const projectButtons = document.querySelectorAll(".project-arrow");

  projectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const projectCard = button.closest(".project-card");
      projectCard.classList.toggle("is-flipped");
    });
  });
}

setupProjectCards();
