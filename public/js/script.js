const ul = document.querySelector(".navbar-ul");
const burgerMenu = document.querySelector(".burger-menu");
const errorDiv = document.querySelector(".error-msg");

// For error message
window.addEventListener("load", () => {
	if (!isCatchUpOn()) showMessage();
});

// For burger menu
burgerMenu.addEventListener("click", (event) => {
	ul.classList.toggle("hide-burger-menu");
	event.stopPropagation();
});

window.addEventListener("click", () => {
	ul.classList.add("hide-burger-menu");
});

// Utility functions
function isCatchUpOn() {
	const paramString = window.location.search;

	if (paramString === "") return true;

	const searchParams = new URLSearchParams(paramString);
	const catchUpStatus = searchParams.get("isCatchUpOn");

	if (catchUpStatus === "false") return false;
	else return true;
}

function showMessage() {
	errorDiv.classList.remove("hidden");
}
