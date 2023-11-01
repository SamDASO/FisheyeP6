/////////////////////////LIGHTBOX/////////////////////

//////////// DOM elements

//Medias genereted
const containerMedia = document.querySelector(".media");

//lightbox
const lightboxContainer = document.querySelector(".lightbox-display");
const lightbox = document.getElementById("lightbox");
const closeLightbox = document.getElementById("close-lightbox");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");

let currentIndex;
let photographerMediaLinks = [];

// Function to display lightbox
function displayLightbox(index) {
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.setAttribute("aria-hidden", "true");
  document.body.classList.add("overflow-hidden");

  // Clear the previous content
  lightboxContainer.innerHTML = "";

  if (photographerMediaLinks[index]) {
    // Create an <li> element with the media
    const liElement = document.createElement("li");
    // Find the title within media-description and add it to the div
    const mediaDescription = photographerMediaLinks[index].nextElementSibling;
    const title = mediaDescription.querySelector(".media-title");
    title.setAttribute("aria-hidden", "true");
    lightboxContainer.setAttribute("aria-describedby", title);

    liElement.innerHTML = photographerMediaLinks[index].outerHTML;
    liElement.setAttribute("aria-label", title);
    liElement.setAttribute("tabindex", "1");

    liElement.appendChild(title.cloneNode(true));
    lightboxContainer.appendChild(liElement);

    photographerMediaLinks.forEach((mediaLink) => {
      mediaLink.removeAttribute("tabindex");
    });

    currentIndex = index;
  }
}

// Create a MutationObserver to watch for changes in the .media container
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      // When new elements are added, attach click event listeners to media links
      photographerMediaLinks = Array.from(
        containerMedia.querySelectorAll(".media-link")
      );

      photographerMediaLinks.forEach((mediaLink, index) => {
        mediaLink.addEventListener("click", () => {
          displayLightbox(index);
        });
      });
    }
  }
});

// Start observing changes in the .media container
observer.observe(containerMedia, { childList: true, subtree: true });

// Attach event listeners to previous and next buttons
previousButton.addEventListener("click", previousMedia);
nextButton.addEventListener("click", nextMedia);

// Attach event listener to close button
closeLightbox.addEventListener("click", closeModal);

// Function to close the lightbox
function closeModal() {
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  document.body.setAttribute("aria-hidden", "false");
  document.body.classList.remove("overflow-hidden");

  photographerMediaLinks.forEach((mediaLink) => {
    mediaLink.setAttribute("tabindex", "0");
  });

  // Remove tabindex attributes from focusable elements within the lightbox
  const focusableElements = lightboxContainer.querySelectorAll("*[tabindex]");
  focusableElements.forEach((element) => {
    element.tabIndex = -1;
  });
}

// Function to navigate to the previous media
function previousMedia() {
  if (currentIndex > 0) {
    displayLightbox(currentIndex - 1);
  } else {
    displayLightbox(photographerMediaLinks.length - 1);
  }
}

// Function to navigate to the next media
function nextMedia() {
  if (currentIndex < photographerMediaLinks.length - 1) {
    displayLightbox(currentIndex + 1);
  } else {
    displayLightbox(0);
  }
}

//Keyboard use

document.addEventListener("keydown", (event) => {
  if (lightbox.style.display === "flex") {
    switch (event.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowRight":
        nextMedia();
        break;
      case "ArrowLeft":
        previousMedia();
        break;
    }
  }
});
