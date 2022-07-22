function openModal(modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  console.log(modalTimerId);
  if (modalTimerId) {
    clearInterval(modalTimerId);
  }
}

function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  modal.style.display = "none";
  document.body.style.overflow = "";
}

function modal(triggerSelector, modalSelector, modalTimerId) {
  // Modal

  // variables

  const modal = document.querySelector(modalSelector);
  const modalBtn = document.querySelectorAll(triggerSelector);

  // Listener
  modalBtn.forEach((btn) => {
    btn.addEventListener("click", () => openModal(modalSelector, modalTimerId));
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal(modalSelector);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      closeModalmodalSelector;
    }
  });

  // Function

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal(modalSelector, modalTimerId);
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.onclick = (e) => {
    if (e.target == modal) {
      closeModal(modalSelector);
    }
  };

  window.addEventListener("scroll", showModalByScroll);
}
export default modal;
export { closeModal };
export { openModal };
