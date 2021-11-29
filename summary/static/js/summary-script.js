const back_to_top_btn = document.querySelector(".back-to-top-btn");
const header = document.querySelector("#header");
const body = document.querySelector("body");

const db_name = "otc_catchup_summary";
const db_version = 1;
const obj_store_name = "theme";

let theme;
let theme_btn;
let system_dark_theme = window.matchMedia("(prefers-color-scheme: dark)");

// Window load listener

window.addEventListener("load", async () => {
	await loadDatabase(); // Initially sets 'theme' variable.
	createThemeSwitcher();
	applyTheme();
	mobileEdgeCaseStyling();
});

// System/browser theme change listener

if (!system_dark_theme.addEventListener)
	system_dark_theme.addEventListener = (event, listener) =>
		system_dark_theme.addListener(listener);

system_dark_theme.addEventListener("change", async (e) => {
	if (e.matches) theme = "dark";
	else theme = "light";

	applyTheme();
});

// Back to top button

const observer = new IntersectionObserver(scrollToTop);
observer.observe(header);

back_to_top_btn.addEventListener("click", () => header.scrollIntoView(true));

// Functions

function scrollToTop(entries, observer) {
	entries.forEach((entry) => {
		if (entry.isIntersecting) back_to_top_btn.classList.add("hidden");
		else back_to_top_btn.classList.remove("hidden");
	});
}

function createThemeSwitcher() {
	theme_btn = document.createElement("button");

	theme_btn.classList.add("btn", "theme-switcher");
	theme_btn.addEventListener("click", switchTheme);
	body.appendChild(theme_btn);
}

async function switchTheme() {
	if (theme === "light") {
		theme_btn.setAttribute("aria-label", "Light mode");
		body.classList.add("dark");
		theme = "dark";
		await saveDatabase();
	} else {
		theme_btn.setAttribute("aria-label", "Dark mode");
		body.classList.remove("dark");
		theme = "light";
		await saveDatabase();
	}
}

async function applyTheme() {
	if (theme === "light") {
		theme_btn.setAttribute("aria-label", "Dark mode");
		body.classList.remove("dark");
		await saveDatabase();
	} else {
		theme_btn.setAttribute("aria-label", "Light mode");
		body.classList.add("dark");
		await saveDatabase();
	}
}

async function loadDatabase() {
	return new Promise((resolve, reject) => {
		let request = indexedDB.open(db_name, db_version);

		request.addEventListener("error", reject);

		request.addEventListener("upgradeneeded", (e) => {
			let db = e.target.result;

			if (!db.objectStoreNames.contains(obj_store_name))
				db.createObjectStore(obj_store_name);
		});

		request.addEventListener("success", (e) => {
			let db = e.target.result;

			let transaction = db.transaction(obj_store_name, "readonly");
			let store = transaction.objectStore(obj_store_name);

			let getTheme = store.get("theme");
			getTheme.addEventListener("error", reject);
			getTheme.addEventListener("success", (e) => {
				let idb_theme = e.target.result;

				if (idb_theme) theme = idb_theme;
				else {
					if (system_dark_theme.matches) theme = "dark";
					else theme = "light";
				}

				resolve();
			});
		});
	});
}

async function saveDatabase() {
	return new Promise((resolve, reject) => {
		let request = indexedDB.open(db_name, db_version);

		request.addEventListener("error", reject);

		request.addEventListener("success", (e) => {
			let db = e.target.result;

			let transaction = db.transaction(obj_store_name, "readwrite");
			let store = transaction.objectStore(obj_store_name);

			store.put(theme, "theme");
			resolve();
		});
	});
}

function mobileEdgeCaseStyling() {
	const user_agent = navigator.userAgent;

	if (
		(user_agent.indexOf("Edg") > -1 && user_agent.indexOf("Mobile") > -1) ||
		user_agent.indexOf("iPhone") > -1
	)
		body.classList.add("mobile-edge-case");
}
