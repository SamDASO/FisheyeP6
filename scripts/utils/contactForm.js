//Datas//
async function getInfoPhotographers() {
  const dataPhotographers = await fetch("../../data/photographers.json");
  return dataPhotographers.json();
}

// contact template modified to match the photographer name
async function getPhotographerName() {
  const { photographers } = await getInfoPhotographers();

  const param = new URLSearchParams(document.location.search);
  const id = param.get("id");
  let photographer;

  if (!id) {
    console.error("missing id parameter");
    return;
  }

  for (let i = 0; i < photographers.length; i++) {
    if (photographers[i].id == id) {
      photographer = photographers[i];
    }
  }

  const container = document.createElement("div");
  container.className = "container-contact";

  const namePhotographer = document.createElement("p");
  namePhotographer.innerText = photographer.name;
  namePhotographer.className = "contact-photograph-name";

  modalHeader.appendChild(container);
  container.appendChild(title);
  container.appendChild(namePhotographer);
  modalHeader.appendChild(closeModalBtn);

  return modalHeader;
}

getPhotographerName();

//Dom elements

const bodyPhotographer = document.querySelector(".body-photographer");
const modal = document.getElementById("contact_modal");
const modalHeader = document.querySelector(".modal-header");
const title = document.querySelector(".modal-title");
const closeModalBtn = document.querySelector(".close-modal");
const contactBtn = document.getElementById("contact-open");
const sendBtn = document.getElementById("send-contact");

const firstNameElement = document.getElementById("first");
const lastNameElement = document.getElementById("last");
const emailElement = document.getElementById("email");
const messageElement = document.getElementById("message");

//Display functions

function displayModal() {
  modal.style.display = "flex";
  bodyPhotographer.classList.add("overflow-hidden");

  if (firstNameElement) {
    firstNameElement.focus();
  }
}

function closeModalForm() {
  modal.style.display = "none";
  bodyPhotographer.classList.remove("overflow-hidden");
}

//Launch modal
contactBtn.addEventListener("click", displayModal);

//Close modal
closeModalBtn.addEventListener("click", closeModalForm);
modal.addEventListener("keydown", closeWithKeyboard);

//Submit form
sendBtn.addEventListener("click", submitForm);

function submitForm(event) {
  event.preventDefault();
  let isFillingForm;

  isFillingForm =
    fillingForm(firstNameElement, "prénom") +
    fillingForm(lastNameElement, "nom") +
    fillingForm(emailElement, "e-mail") +
    fillingForm(messageElement, "message");

  if (isFillingForm > 0) {
    return false;
  } else {
    closeModalForm();
    alert("Your message has been sent");
    return true;
  }
}

function fillingForm(input, label) {
  let inputField = input.value;
  if (!inputField) {
    return 1;
  } else {
    console.log(`User input for the "${label}": ${inputField}`);
    return 0;
  }
}

/////Keyboard accessibility

function closeWithKeyboard(event) {
  if (event.key === "Escape") {
    closeModalForm();
  }
}

modal.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    // Get all focusable elements within the modal
    const focusableElements = modal.querySelectorAll("input, button");

    if (focusableElements.length === 0) return;

    // Find the index of the currently focused element
    const focusedIndex = Array.from(focusableElements).indexOf(
      document.activeElement
    );

    if (event.shiftKey) {
      // Shift + Tab: Move focus to the previous element
      if (focusedIndex === 0) {
        focusableElements[focusableElements.length - 1].focus();
        event.preventDefault();
      }
    } else {
      // Tab: Move focus to the next element
      if (focusedIndex === focusableElements.length - 1) {
        focusableElements[0].focus();
        event.preventDefault();
      }
    }
  } else if (event.key === "Escape") {
    closeModalForm();
  }
});
