const searchForm = document.querySelector(".search__form");
const profileImg = document.querySelector(".profile__img");
const profileName = document.querySelector(".profile__heading");
const profileInfo = document.querySelector(".profile__info");
const profileRepos = document.querySelector(".repos");
const profileFollowers = document.querySelector(".followers");
const profileFollowing = document.querySelector(".following");
const profileLocation = document.querySelector(".location");
const profileTwitter = document.querySelector(".twitter");
const profileCompany = document.querySelector(".company");
const profileBio = document.querySelector(".bio");
const profileWebsite = document.querySelector(".website");

const themeText = document.querySelector(".header__theme-text");
const themeIcon = document.querySelector(".header__theme-icon");
const themeMode = window.matchMedia("(prefers-color-scheme: dark)");

// fetch github api

const getProfile = async (username) => {
  const response = await fetch("https://api.github.com/users/" + username);
  if (response.status !== 200) {
    throw new Error("No results");
  } else {
    searchForm.removeAttribute("error");
  }
  const data = response.json();

  return data;
};

// update UI

const updateUI = (username) => {
  //formatting the date user joined

  const date = new Date(username.created_at);
  const formattedDate = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  //update profile avatar

  profileImg.setAttribute("src", username.avatar_url);

  //update prosonal info

  profileInfo.innerHTML = `
    <h2 class="profile__heading">${username.name || username.login}</h2>
    <p class="profile__username">@${username.login}</p>
    <p class="profile__date">Joined ${formattedDate}</p>
  `;

  // update profile bio

  if (username.bio === null) {
    profileBio.textContent = "This profile has no bio.";
    profileBio.classList.toggle("not-available-text-style");
  } else {
    profileBio.textContent = `${username.bio}`;
    profileBio.classList.remove("not-available-text-style");
  }

  //update profile stats

  profileRepos.textContent = `${username.public_repos}`;
  profileFollowers.textContent = `${username.followers}`;
  profileFollowing.textContent = `${username.following}`;

  //update profile links

  if (username.location === null) {
    profileLocation.textContent = "Not Available";
    profileLocation.classList.add("not-available-text-style");
  } else {
    profileLocation.textContent = `${username.location}`;
    profileLocation.classList.remove("not-available-text-style");
  }

  if (username.blog === null || username.blog === "") {
    profileWebsite.innerHTML = `
    <img src="assets/icon-website.svg" alt="" />
    <p class="links__text text-light not-available-text-style">Not Available</p>
    `;
  } else {
    profileWebsite.innerHTML = `
    <img src="assets/icon-website.svg" alt="" />
    <a href="${username.blog}" target="_blank" class="links__text text-light">${username.blog}</a>
    `;
  }

  if (username.twitter_username === null) {
    profileTwitter.innerHTML = `
    <img src="assets/icon-twitter.svg" alt="" />
    <p class="links__text text-light not-available-text-style">Not Available</p>
    `;
  } else {
    profileTwitter.innerHTML = `
    <img src="assets/icon-twitter.svg" alt="" />
    <a href="https://twitter.com/${username.twitter_username}" target="_blank" class="links__text text-light">${username.twitter_username}</a>
    `;
  }

  if (username.company === null) {
    profileCompany.innerHTML = `
    <img src="assets/icon-company.svg" alt="" />
    <p class="links__text text-light not-available-text-style">Not Available</p>
    `;
  } else if (username.company !== null && username.company.charAt(0) === "@") {
    profileCompany.innerHTML = `
    <img src="assets/icon-company.svg" alt="" />
    <a href="https://github.com/${username.company.substring(
      1
    )}" target="_blank" class="links__text text-light">${username.company.substring(
      1
    )}</a>
    `;
  } else {
    profileCompany.innerHTML = `
    <img src="assets/icon-company.svg" alt="" />
    <a href="${username.blog}" target="_blank" class="links__text text-light">${username.company}</a>
    `;
  }
};

// Submit event in search bar

searchForm.addEventListener("submit", (e) => {
  //prevent default submit action
  e.preventDefault();

  //get username value
  const username = searchForm.search.value.trim();
  searchForm.reset();

  getProfile(username)
    .then((data) => updateUI(data))
    .catch((error) => searchForm.setAttribute("error", error.message));
});

// light or dark mode

window.onload = () => {
  //uopdate theme based on preferred browser theme of user
  if (themeMode.matches) {
    themeText.textContent = "DARK";
    themeIcon.setAttribute("src", "assets/icon-moon.svg");
  } else {
    themeText.textContent = "LIGHT";
    themeIcon.setAttribute("src", "assets/icon-sun.svg");
  }

  // load octocat github profile on window load
  getProfile("octocat").then((data) => updateUI(data));
};

themeMode.addEventListener("change", (event) => {
  if (event.matches) {
    themeText.textContent = "DARK";
    themeIcon.setAttribute("src", "assets/icon-moon.svg");
  } else {
    themeText.textContent = "LIGHT";
    themeIcon.setAttribute("src", "assets/icon-sun.svg");
  }
});
