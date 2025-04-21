const sections = document.querySelectorAll("section");
const navBar = document.querySelector(".page__header");

// Build the navigation bar
sections.forEach((section) => {
  const navItem = document.createElement("li");
  const navLink = document.createElement("a");
  navLink.href = `#${section.id}`;
  navLink.textContent = section.dataset.nav;
  navLink.classList.add("menu__link");
  navItem.appendChild(navLink);
  navBar.querySelector("#navbar__list").appendChild(navItem);
});

// Add smooth scrolling
const navLinks = document.querySelectorAll(".menu__link");
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Highlight active section
function isSectionInViewport(section) {
  const position = section.getBoundingClientRect().top;
  return position >= 0 && position < 300;
}

function toggleActiveClass() {
  sections.forEach((section) => {
    if (isSectionInViewport(section)) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", toggleActiveClass);

// Scroll-to-Top Button
const scrollToTopButton = document.createElement("button");
scrollToTopButton.id = "scrollToTop";
scrollToTopButton.innerHTML = "&#8679;";
document.body.appendChild(scrollToTopButton);

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});

// Hide Navigation Bar After Inactivity
let isScrolling;
window.addEventListener("scroll", () => {
  navBar.style.display = "block";
  clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    navBar.style.display = "none";
  }, 2000);
});

// Make Sections Collapsible
sections.forEach((section) => {
  const content = section.querySelectorAll("p"); // Select all <p> elements inside the section
  if (content.length > 0) {
    const toggleButton = document.createElement("button");
    toggleButton.classList.add("collapse-button");
    toggleButton.textContent = "Collapse";
    toggleButton.addEventListener("click", () => {
      content.forEach((p) => {
        if (p.style.display === "none") {
          p.style.display = "block";
          toggleButton.textContent = "Collapse";
        } else {
          p.style.display = "none";
          toggleButton.textContent = "Expand";
        }
      });
    });
    section.querySelector(".landing__container").appendChild(toggleButton); // Append button inside the container
  }
});

// Comments Section
const commentsSection = document.createElement("section");
commentsSection.id = "comments";
commentsSection.dataset.nav = "Comments";
commentsSection.innerHTML = `
  <div class="landing__container">
    <h2>Comments</h2>
    <form id="commentForm">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      <label for="comment">Comment:</label>
      <textarea id="comment" name="comment" rows="4" required></textarea>
      <button type="submit">Submit</button>
    </form>
    <div id="commentsList">
      <h3>All Comments</h3>
    </div>
    <button id="clearComments">Clear Comments</button>
  </div>
`;

document.querySelector("main").appendChild(commentsSection);

const commentsNavItem = document.createElement("li");
const commentsNavLink = document.createElement("a");
commentsNavLink.href = `#comments`;
commentsNavLink.textContent = "Comments";
commentsNavLink.classList.add("menu__link");
commentsNavItem.appendChild(commentsNavLink);
navBar.querySelector("#navbar__list").appendChild(commentsNavItem);

commentsNavLink.addEventListener("click", (event) => {
  event.preventDefault();
  const targetSection = document.getElementById("comments");
  targetSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !email || !comment) {
    alert("Please fill out all fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  const commentElement = document.createElement("div");
  commentElement.classList.add("comment");
  commentElement.innerHTML = `
    <p><strong>${name}</strong> (${email})</p>
    <p>${comment}</p>
  `;
  commentsList.appendChild(commentElement);
  commentForm.reset();
  saveCommentsToLocalStorage();
});

const saveCommentsToLocalStorage = () => {
  const comments = Array.from(document.querySelectorAll(".comment")).map(
    (comment) => comment.innerHTML
  );
  localStorage.setItem("comments", JSON.stringify(comments));
};

const loadCommentsFromLocalStorage = () => {
  try {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.forEach((commentHTML) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = commentHTML;
      commentsList.appendChild(commentElement);
    });
  } catch (error) {
    console.error("Error loading comments from localStorage:", error);
  }
};

window.addEventListener("DOMContentLoaded", loadCommentsFromLocalStorage);

const clearCommentsButton = document.getElementById("clearComments");
clearCommentsButton.addEventListener("click", () => {
  localStorage.removeItem("comments");
  commentsList.innerHTML = "<h3>All Comments</h3>";
});
