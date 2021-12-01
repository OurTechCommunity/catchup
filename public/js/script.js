const errorDiv = document.querySelector(".error-msg");

window.addEventListener("load", () => {
	if (!isCatchUpOn()) showMessage();
});

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
