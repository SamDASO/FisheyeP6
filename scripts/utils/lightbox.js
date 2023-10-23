//DOM ELEMENTS

const mediaArticles = document.querySelectorAll(".media-article");
const photographerMedias = document.querySelectorAll(".media-lightbox");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.querySelector(".lightbox-display");
const closeLightbox = document.getElementById("close-lightbox");

//Display lightbox

photographerMedias.forEach((media) =>
  media.addEventListener("click", displayLightbox)
);

function displayLightbox(media) {
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.setAttribute("aria-hidden", "true");

  lightboxContent.appendChild(media);
}

/*if (media > mediaArticles.length) {
    index = 1;
  }

  if (article < 1) {
    index = mediaArticles.length;
  }

  for (index = 0; index < mediaArticles.length; index++) {
    mediaArticles[index].style.display = "none";
  }

  mediaArticles[index - 1].style.display = "block";
}*/

//Faire une fonction previous et next

//Close lighbox
closeLightbox.addEventListener("click", closeModal);

function closeModal() {
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  document.body.setAttribute("aria-hidden", "false");
}

//Keyboard use

lightbox.addEventListener("keydown", (key) => {
  if (key.code === "Escape") {
    closeModal();
  }
  if (key.code === "ArrowRight") {
    nextMedia();
  }
  if (key.code === "ArrowLeft") {
    previousMedia();
  }
});
