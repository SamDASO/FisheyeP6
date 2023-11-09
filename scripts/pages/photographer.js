//Imports

import {
  photographInfoTemplate,
  photographPicture,
  mediasTemplate,
} from "../templates/photographer.js";

//JSON Datas
export async function getDataPhotographers() {
  const dataPhotographers = await fetch("../../data/photographers.json");
  return dataPhotographers.json();
}

/////////////////////HEADER

function displayInfo(photographer) {
  const photographerInfo = document.querySelector(".photograph-info");
  const photographerPictureSection = document.querySelector(
    ".photograph-profilephoto"
  );

  const photographerModel = photographInfoTemplate(photographer);
  const userCardInfoDOM = photographerModel.getUserInfoDOM();
  const photographerPicture = photographPicture(photographer);
  const userPicture = photographerPicture.getUserPicture();

  photographerInfo.appendChild(userCardInfoDOM);
  photographerPictureSection.appendChild(userPicture);
}

//////////////SORTED LIST

////DOM ELEMENTS
const sortButton = document.getElementById("sort-button");
const sortOptionContainer = document.getElementById("sort-option-container");
const sortOptions = document.querySelectorAll(".sort-option");

//MEDIAS
const sectionMedia = document.querySelector(".media");

let isMenuOpen = false;

////DISPLYING MENU LIST

sortButton.addEventListener("click", menuToggle);

function setInitialFocus() {
  const firstOption = sortOptionContainer.querySelector('[tabindex="0"]');
  if (firstOption) {
    firstOption.focus();
  }
}

function menuToggle() {
  if (isMenuOpen) {
    sortOptionContainer.style.display = "none";
    sortButton.setAttribute("aria-expanded", "false");
    sortButton.style.display = "flex";
    isMenuOpen = false;
  } else {
    sortOptionContainer.style.display = "block";
    sortButton.setAttribute("aria-expanded", "true");
    sortButton.style.display = "none";
    setInitialFocus();
    isMenuOpen = true;
  }
}

///Arrow and accessibility in the sort list

//On click
sortOptions.forEach((option) => {
  option.addEventListener("click", function () {
    sortButton.querySelector("span").textContent = this.textContent;

    menuToggle();

    sortOptions.forEach((item) => {
      const selectedOption = this;
      if (item === selectedOption) {
        const arrowUp = document.createElement("div");
        arrowUp.classList.add("arrow-up");
        arrowUp.setAttribute("aria-hidden", "true");
        item.setAttribute("aria-selected", "true");

        // Move the selected item to the top of the list
        sortOptionContainer.insertBefore(
          item,
          sortOptionContainer.firstElementChild
        );

        const arrowUpElement = item.querySelector(".arrow-up");
        if (!arrowUpElement) {
          item.appendChild(arrowUp);
        }
      }

      sortOptions.forEach((item) => {
        if (item !== selectedOption) {
          const arrowUpElement = item.querySelector(".arrow-up");
          if (arrowUpElement) {
            item.removeChild(arrowUpElement);
          }
          item.setAttribute("aria-selected", "false");
        }
      });
    });

    sortButton.setAttribute("aria-expanded", "false");
  });
});

//With keyboard

sortOptions.forEach((option) => {
  option.addEventListener("keydown", function (event) {
    const selectedOption = this;
    if (event.key === "Enter") {
      sortOptions.forEach((item) => {
        if (item === selectedOption) {
          const arrowUp = document.createElement("div");
          arrowUp.classList.add("arrow-up");
          arrowUp.setAttribute("aria-hidden", "true");
          item.setAttribute("aria-selected", "true");

          // Move the selected item to the top of the list
          sortOptionContainer.insertBefore(
            item,
            sortOptionContainer.firstElementChild
          );
          const arrowUpElement = item.querySelector(".arrow-up");
          if (!arrowUpElement) {
            item.appendChild(arrowUp);
          }
          item.focus();
        }
      });
    }

    sortOptions.forEach((item) => {
      if (item !== selectedOption) {
        const arrowUpElement = item.querySelector(".arrow-up");
        if (arrowUpElement) {
          item.removeChild(arrowUpElement);
        }
        item.setAttribute("aria-selected", "false");
      }
    });

    sortButton.setAttribute("aria-expanded", "false");
  });
});

/////////////////MEDIAS

function displayMediaUpdate(sortedMedia, targetElement) {
  // Clear the current content
  targetElement.innerHTML = "";

  // Loop through the sorted media and append them to the target element
  sortedMedia.forEach((mediaItem) => {
    targetElement.appendChild(mediaItem);
  });
}

function sortedByPopularityMedia(photographer, allMedia) {
  return allMedia
    .filter((media) => media.photographerId === photographer.id)
    .sort((a, b) => b.likes - a.likes)
    .map((media) => {
      const mediaModel = mediasTemplate(photographer, media);
      const likeButton = mediaModel.querySelector(".likes-container");
      const likeCountElement = mediaModel.querySelector(".likes");

      likeButton.addEventListener("click", () => {
        if (likeButton.classList.contains("liked")) {
          media.likes -= 1;
          likeButton.classList.remove("liked");
        } else {
          media.likes += 1;
          likeButton.classList.add("liked");
        }
        likeCountElement.textContent = media.likes;
        updateTotalLikes(photographer, allMedia);
      });
      return mediaModel;
    });
}

function sortedByDateMedia(photographer, allMedia) {
  return allMedia
    .filter((media) => media.photographerId == photographer.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((media) => {
      const mediaModel = mediasTemplate(photographer, media);
      const likeButton = mediaModel.querySelector(".likes-container");
      const likeCountElement = mediaModel.querySelector(".likes");

      likeButton.addEventListener("click", () => {
        if (likeButton.classList.contains("liked")) {
          media.likes -= 1;
          likeButton.classList.remove("liked");
        } else {
          media.likes += 1;
          likeButton.classList.add("liked");
        }
        likeCountElement.textContent = media.likes;
        updateTotalLikes(photographer, allMedia);
      });
      return mediaModel;
    });
}

function sortedByTitleMedia(photographer, allMedia) {
  return allMedia
    .filter((media) => media.photographerId == photographer.id)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((media) => {
      const mediaModel = mediasTemplate(photographer, media);
      const likeButton = mediaModel.querySelector(".likes-container");
      const likeCountElement = mediaModel.querySelector(".likes");

      likeButton.addEventListener("click", () => {
        if (likeButton.classList.contains("liked")) {
          media.likes -= 1;
          likeButton.classList.remove("liked");
        } else {
          media.likes += 1;
          likeButton.classList.add("liked");
        }
        likeCountElement.textContent = media.likes;
        updateTotalLikes(photographer, allMedia);
      });

      return mediaModel;
    });
}

// Keyboard accessibility

const sortFunctions = {
  popularity: sortedByPopularityMedia,
  date: sortedByDateMedia,
  title: sortedByTitleMedia,
};

///////////////////Total Likes template and update

function updateTotalLikes(photographer, media) {
  const totalLikes = media
    .filter((mediaItem) => mediaItem.photographerId === photographer.id)
    .reduce((total, mediaItem) => total + mediaItem.likes, 0);

  const likesCountContainer = document.getElementById("likes-count-container");

  while (likesCountContainer.firstChild) {
    likesCountContainer.removeChild(likesCountContainer.firstChild);
  }

  const divLikes = document.createElement("div");
  divLikes.classList.add("likes-div");

  const heart = document.createElement("img");
  const heartIcon = "../assets/icons/heart-icon.svg";
  heart.setAttribute("src", heartIcon);
  heart.setAttribute("alt", "j'aimes totaux");
  heart.classList.add("heart-icon");

  const totalLikesText = document.createTextNode(totalLikes);

  const priceElement = document.createElement("p");
  priceElement.textContent = `${photographer.price}€/jour`;
  priceElement.className = "price-by-day";

  divLikes.appendChild(totalLikesText);
  divLikes.appendChild(heart);
  likesCountContainer.appendChild(divLikes);
  likesCountContainer.appendChild(priceElement);
}

//Function init

async function init() {
  // JSON DATAS
  const { photographers, media } = await getDataPhotographers();

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

  displayInfo(photographer);

  ///Sorted medias

  const popularOption = document.querySelector(
    ".sort-option[data-value='popularity']"
  );
  const dateOption = document.querySelector(".sort-option[data-value='date']");
  const titleOption = document.querySelector(
    ".sort-option[data-value='title']"
  );

  const sortedByPopularity = sortedByPopularityMedia(photographer, media);

  //by default
  displayMediaUpdate(sortedByPopularity, sectionMedia);

  //by popularity (the most liked media first)
  popularOption.addEventListener("click", () => {
    displayMediaUpdate(sortedByPopularity, sectionMedia);
  });

  //by date (the most recent first)
  const sortedByDate = sortedByDateMedia(photographer, media);

  dateOption.addEventListener("click", () => {
    displayMediaUpdate(sortedByDate, sectionMedia);
  });

  //by title (alphabetical order)
  const sortedByTitle = sortedByTitleMedia(photographer, media);

  titleOption.addEventListener("click", () => {
    displayMediaUpdate(sortedByTitle, sectionMedia);
  });

  //by keyboard

  // Function to set tabindex for options
  function setTabindex(option, tabindex) {
    option.tabIndex = tabindex;
    option.setAttribute("tabindex", tabindex);
  }

  //event listener for arrow key navigation
  sortOptionContainer.addEventListener("keydown", function (event) {
    const selectedOption = sortOptionContainer.querySelector(
      '.sort-option[aria-selected="true"]'
    );

    if (event.key === "Enter") {
      event.preventDefault();
      // Selection of the option
      const selectedValue = selectedOption.getAttribute("data-value");
      const sortFunction = sortFunctions[selectedValue];

      if (sortFunction) {
        sortButton.querySelector("span").textContent =
          selectedOption.textContent;
        menuToggle();
        sortButton.focus();

        // ARIA Attributes
        sortOptions.forEach((item) => {
          if (item === selectedOption) {
            item.classList.add("hidden-option");
            item.setAttribute("aria-selected", "true");
            item.setAttribute("tabindex", "0"); // Set tabindex to 0 for the selected option
          } else {
            item.classList.remove("hidden-option");
            item.setAttribute("aria-selected", "false");
            item.setAttribute("tabindex", "-1"); // Set tabindex to -1 for other options
          }
        });

        sortButton.setAttribute("aria-expanded", "false");
        displayMediaUpdate(sortFunction(photographer, media), sectionMedia);
      }
    }

    // Determine the current index and maximum index
    const currentIndex = Array.from(sortOptions).indexOf(selectedOption);
    const maxIndex = sortOptions.length - 1;

    if (event.key === "ArrowUp" && currentIndex > 0) {
      // Move focus up
      selectedOption.setAttribute("aria-selected", "false");
      setTabindex(selectedOption, -1);

      const newIndex = currentIndex - 1;
      const newSelectedOption = sortOptions[newIndex];
      newSelectedOption.setAttribute("aria-selected", "true");
      setTabindex(newSelectedOption, 0);
      newSelectedOption.focus();
    } else if (event.key === "ArrowDown" && currentIndex < maxIndex) {
      // Move focus down
      selectedOption.setAttribute("aria-selected", "false");
      setTabindex(selectedOption, -1);

      const newIndex = currentIndex + 1;
      const newSelectedOption = sortOptions[newIndex];
      newSelectedOption.setAttribute("aria-selected", "true");
      setTabindex(newSelectedOption, 0);
      newSelectedOption.focus();
    }
  });

  // Add a blur event listener to the list container to close the list when it loses focus
  sortOptionContainer.addEventListener("blur", function () {
    sortOptionContainer.setAttribute("aria-expanded", "false");
  });

  sortOptions.forEach((option, index) => {
    option.addEventListener("keydown", function (event) {
      option.tabIndex = index === 0 ? 0 : -1;
      if (event.key === "Escape") {
        // If the user presses Tab, close the menu and focus on the button
        event.preventDefault();
        menuToggle();
        sortButton.focus();
      }
    });
  });

  //Total likes

  updateTotalLikes(photographer, media);
}

init();
