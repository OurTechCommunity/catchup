const backToTopBtn = document.querySelector(".back-to-top-btn");
const header = document.querySelector("#header");
const body = document.querySelector("body");

const dbName = "otc_catchup_summary";
const dbVersion = 1;
const objStoreName = "theme";

let theme;
let themeBtn;
let systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");

// Window load listener

window.addEventListener("load", async () => {
	await loadDatabase(); // Initially sets 'theme' variable.
	createThemeSwitcher();
	applyTheme();
	mobileEdgeCaseStyling();
});

// System/browser theme change listener

if (!systemDarkTheme.addEventListener)
	systemDarkTheme.addEventListener = (event, listener) =>
		systemDarkTheme.addListener(listener);

systemDarkTheme.addEventListener("change", async (e) => {
	if (e.matches) theme = "dark";
	else theme = "light";

	applyTheme();
});

// Back to top button

const observer = new IntersectionObserver(scrollToTop);
observer.observe(header);

backToTopBtn.addEventListener("click", () => header.scrollIntoView(true));

// Functions

function scrollToTop(entries, observer) {
	entries.forEach((entry) => {
		if (entry.isIntersecting) backToTopBtn.classList.add("hidden");
		else backToTopBtn.classList.remove("hidden");
	});
}

function createThemeSwitcher() {
	themeBtn = document.createElement("button");

	themeBtn.classList.add("btn", "theme-switcher");
	themeBtn.addEventListener("click", switchTheme);
	body.appendChild(themeBtn);
}

async function switchTheme() {
	if (theme === "light") {
		themeBtn.setAttribute("aria-label", "Light mode");
		body.classList.add("dark");
		theme = "dark";
		await saveDatabase();
	} else {
		themeBtn.setAttribute("aria-label", "Dark mode");
		body.classList.remove("dark");
		theme = "light";
		await saveDatabase();
	}
}

async function applyTheme() {
	if (theme === "light") {
		themeBtn.setAttribute("aria-label", "Dark mode");
		body.classList.remove("dark");
		await saveDatabase();
	} else {
		themeBtn.setAttribute("aria-label", "Light mode");
		body.classList.add("dark");
		await saveDatabase();
	}
}

async function loadDatabase() {
	return new Promise((resolve, reject) => {
		let request = indexedDB.open(dbName, dbVersion);

		request.addEventListener("error", reject);

		request.addEventListener("upgradeneeded", (e) => {
			let db = e.target.result;

			if (!db.objectStoreNames.contains(objStoreName))
				db.createObjectStore(objStoreName);
		});

		request.addEventListener("success", (e) => {
			let db = e.target.result;

			let transaction = db.transaction(objStoreName, "readonly");
			let store = transaction.objectStore(objStoreName);

			let getTheme = store.get("theme");
			getTheme.addEventListener("error", reject);
			getTheme.addEventListener("success", (e) => {
				let idbTheme = e.target.result;

				if (idbTheme) theme = idbTheme;
				else {
					if (systemDarkTheme.matches) theme = "dark";
					else theme = "light";
				}

				resolve();
			});
		});
	});
}

async function saveDatabase() {
	return new Promise((resolve, reject) => {
		let request = indexedDB.open(dbName, dbVersion);

		request.addEventListener("error", reject);

		request.addEventListener("success", (e) => {
			let db = e.target.result;

			let transaction = db.transaction(objStoreName, "readwrite");
			let store = transaction.objectStore(objStoreName);

			store.put(theme, "theme");
			resolve();
		});
	});
}

function mobileEdgeCaseStyling() {
	const userAgent = navigator.userAgent;

	if (
		(userAgent.indexOf("Edg") > -1 && userAgent.indexOf("Mobile") > -1) ||
		userAgent.indexOf("iPhone") > -1
	)
		body.classList.add("mobile-edge-case");
}
