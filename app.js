const searchForm = document.querySelector(".search__form");
const profileImg = document.querySelector(".profile__img");
const profileName = document.querySelector(".profile__heading");
const profileInfo = document.querySelector(".profile__info");
const profileRepos = document.querySelector(".repos");
const profileFollowers = document.querySelector(".followers");
const profileFollowing = document.querySelector(".following");
const profileLocation = document.querySelector(".location");
const profileWebsite = document.querySelector(".website");
const profileTwitter = document.querySelector(".twitter");
const profileCompany = document.querySelector(".company");
const profileBio = document.querySelector(".bio");

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
    <span class="profile__username">@${username.login}</span>
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

  if (username.blog === null) {
    profileWebsite.textContent = "Not Available";
    profileWebsite.classList.add("not-available-text-style");
  } else {
    profileWebsite.textContent = `${username.blog}`;
    profileWebsite.setAttribute("href", username.blog);
    profileWebsite.classList.remove("not-available-text-style");
  }

  if (username.twitter_username === null) {
    profileTwitter.textContent = "Not Available";
    profileTwitter.classList.add("not-available-text-style");
    profileTwitter.removeAttribute("href");
  } else {
    profileTwitter.textContent = `${username.twitter_username}`;
    profileTwitter.setAttribute(
      "href",
      `https://twitter.com/${username.twitter_username}`
    );
    profileTwitter.classList.remove("not-available-text-style");
  }

  if (username.company === null) {
    profileCompany.textContent = "Not Available";
    profileCompany.classList.add("not-available-text-style");
    profileCompany.removeAttribute("href");
  } else if (username.company !== null && username.company.charAt(0) === "@") {
    profileCompany.textContent = `${username.company.substring(1)}`;
    profileCompany.setAttribute(
      "href",
      `https://github.com/${username.company.substring(1)}`
    );
    profileCompany.classList.remove("not-available-text-style");
  } else {
    profileCompany.textContent = `${username.company}`;
    profileCompany.setAttribute("href", username.blog);
    profileCompany.classList.remove("not-available-text-style");
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

const themeText = document.querySelector(".header__theme-text");
const themeIcon = document.querySelector(".header__theme-icon");
const themeMode = window.matchMedia("(prefers-color-scheme: dark)");

themeMode.addEventListener("change", (event) => {
  if (event.matches) {
    themeText.textContent = "DARK";
    themeIcon.setAttribute("src", "assets/icon-moon.svg");
  } else {
    themeText.textContent = "LIGHT";
    themeIcon.setAttribute("src", "assets/icon-sun.svg");
  }
});

window.onload(() => {
  if (themeMode.matches) {
    themeText.textContent = "DARK";
    themeIcon.setAttribute("src", "assets/icon-moon.svg");
  } else {
    themeText.textContent = "LIGHT";
    themeIcon.setAttribute("src", "assets/icon-sun.svg");
  }
});
