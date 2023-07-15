const time = process.argv[2];
const [hours, minutes] = time.split(":").map((d) => parseInt(d));
if (!time || !isFinite(hours) || !isFinite(minutes)) {
	console.error(`invalid timestamp: ${time}`);
	process.exit(1);
}

let now = new Date(
	new Date().toLocaleString("en-US", {
		timeZone: "Asia/Kolkata"
	})
);

let date = new Date(now);
date.setHours(hours);
date.setMinutes(minutes);
date.setSeconds(0);

let seconds = Math.floor((date.getTime() - now.getTime()) / 1000);
if (seconds < 0) seconds = 0;
console.log(seconds);

console.warn(`waiting for ${seconds} till ${time}`);
