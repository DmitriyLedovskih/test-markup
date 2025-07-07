const header = document.querySelector(".header");
const fixed = document.querySelector("#fixed");

let currentHeaderHeight = 0;

const updateHeaderHeight = () => {
  if (fixed.classList.contains("header__main-block--fixed")) {
    currentHeaderHeight = fixed.offsetHeight;
  } else {
    currentHeaderHeight = header ? header.offsetHeight : 0;
  }
};

const toggleModal = () => {
  let show = false;
  return (modal, buttonSelector) => {
    show = !show;
    if (show) openModal(modal, buttonSelector);
    else closeModal(modal, buttonSelector);
  };
};

const updateModalPosition = (modal, buttonSelector) => {
  const buttontRect = buttonSelector.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;

  modal.style.left = `${buttontRect.left + scrollX}px`;
  modal.style.top = `${currentHeaderHeight}px`;
};

const openModal = (modal, buttonSelector) => {
  updateHeaderHeight();
  updateModalPosition(modal, buttonSelector);

  modal.style.transform = `translateX(0)`;
  modal.style.opacity = 1;
  modal.style.visibility = "visible";
  document.body.style.overflow = "hidden";

  const updateHandler = () => updateModalPosition(modal, buttonSelector);

  modal._updateHandler = updateHandler;

  window.addEventListener("resize", updateHandler);
  window.addEventListener("scroll", updateHandler, { passive: true });
};

const closeModal = (modal) => {
  modal.style.transform = null;
  modal.style.opacity = null;
  modal.style.visibility = null;
  document.body.style.overflow = null;

  if (modal._updateHandler) {
    window.removeEventListener("resize", modal._updateHandler);
    window.removeEventListener("scroll", modal._updateHandler);
    delete modal._updateHandler;
  }
};

export const showModal = (button, modal, type = "click") => {
  const buttonSelector = document.querySelector(button);
  const buttonNotDots = button.replace(".", "");
  const modalSelector = document.querySelector(modal);

  updateHeaderHeight();

  const toggle = toggleModal();

  if (type === "click") {
    buttonSelector.addEventListener("click", () => {
      toggle(modalSelector, buttonSelector);
      buttonSelector.classList.toggle(`${buttonNotDots}--active`);
    });
  } else {
    buttonSelector.addEventListener("mouseenter", () =>
      openModal(modalSelector, buttonSelector)
    );
    modalSelector.addEventListener("mouseenter", () => {
      openModal(modalSelector, buttonSelector);
      buttonSelector.classList.add(`${buttonNotDots}--active`);
    });
    buttonSelector.addEventListener("mouseleave", () =>
      closeModal(modalSelector)
    );
    modalSelector.addEventListener("mouseleave", () => {
      closeModal(modalSelector);
      buttonSelector.classList.remove(`${buttonNotDots}--active`);
    });
  }

  window.addEventListener("resize", updateHeaderHeight);
};

export const showModalMenu = () => {
  const buttons = document.querySelectorAll("[data-modal-button]");
  const modalHeader = document.querySelector(".modal-menu__header");
  const modalMenu = document.querySelector(".modal-menu__nav");
  const mainMenuId = "main";

  const closeAllMenus = () => {
    document.querySelectorAll("[data-menu-block]").forEach((menu) => {
      menu.classList.remove("modal-menu__block--active");
    });

    buttons.forEach((btn) => {
      btn.classList.remove("button--active");
    });
  };

  const openMenu = (menuId) => {
    closeAllMenus();

    const menu = document.querySelector(`[data-menu-block="${menuId}"]`);
    const mainMenu = document.querySelector(
      `[data-menu-block="${mainMenuId}"]`
    );
    if (!menu) return;

    mainMenu.style.display = "none";
    menu.classList.add("modal-menu__block--active");

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        mainMenu.classList.remove("modal-menu__block--active");
        modalHeader.style.display = "none";
        modalMenu.style.display = "none";
      } else {
        mainMenu.classList.add("modal-menu__block--active");
        modalHeader.style.display = "flex";
        modalMenu.style.display = "flex";
      }
    });

    modalHeader.style.display = menuId === mainMenuId ? "flex" : "none";
    modalMenu.style.display = menuId === mainMenuId ? "flex" : "none";
    const button = document.querySelector(`[data-modal-button="${menuId}"]`);
    if (button) button.classList.add("button--active");
  };

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      closeAllMenus();
    }
  });

  const handleBackButton = (currentMenu) => {
    const previousMenuId =
      currentMenu.getAttribute("data-previous") || mainMenuId;
    openMenu(previousMenuId);
  };

  buttons.forEach((button) => {
    const targetId = button.getAttribute("data-modal-button");
    const menu = document.querySelector(`[data-menu-block="${targetId}"]`);
    const backButton = menu?.querySelector(".menu-category__back");

    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.stopPropagation();
        handleBackButton(menu, targetId);
        menu.classList.remove("modal-menu__block--active");
      });
    }

    button.addEventListener("click", () => {
      const currentActive = document.querySelector(
        "[data-menu-block].modal-menu__block--active"
      );
      if (currentActive && currentActive !== menu) {
        menu.setAttribute(
          "data-previous",
          currentActive.getAttribute("data-menu-block")
        );
      }

      openMenu(targetId);
      menu.classList.add("modal-menu__block--active");
    });
  });
};

export const headerFixed = () => {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      fixed.classList.add("header__main-block--fixed");
    } else {
      fixed.classList.remove("header__main-block--fixed");
    }
  });
};
