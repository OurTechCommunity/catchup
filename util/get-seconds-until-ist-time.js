const time = process.argv[2];
const [hours, minutes] = time.split(":");
if (!time || !hours || !minutes) {
	console.error(`invalid timestamp: ${time}`);
	process.exit(1);
}

let now = new Date(
	new Date().toLocaleString("en-US", {
		timeZone: "Asia/Kolkata"
	})
);

let date = new Date(now);

let seconds = Math.floor((date.getTime() - now.getTime()) / 1000);
if (seconds < 0) seconds = 0;
console.log(seconds);
