function modal() {
  // Modal

  // variables

  const modal = document.querySelector(".modal");
  const modalBtn = document.querySelectorAll("[data-modal]");
  const modalTimerId = setTimeout(openModal, 8000);

  // Listener
  modalBtn.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      closeModal();
    }
  });

  // Function

  function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.onclick = (e) => {
    if (e.target == modal) {
      closeModal();
    }
  };

  window.addEventListener("scroll", showModalByScroll);
}
module.exports = modal;
