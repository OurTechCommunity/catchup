function getCurrentMessageTemplate(date = new Date()) {
	let istDate = new Date(
		date.toLocaleString("en-US", {
			timeZone: "Asia/Kolkata"
		})
	);

	// if time is after 10pm on saturday return joining,
	// else return reminder
	// 6 is Saturday
	if (istDate.getDay() === 6 && istDate.getHours() >= 22) return "joining";
	else return "reminder";
}

module.exports = {
	getCurrentMessageTemplate
};

if (require.main) console.log(getCurrentMessageTemplate());
