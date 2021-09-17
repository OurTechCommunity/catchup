const fs = require("fs");

const CONFIG_FILE = "config.json";

function loadConfig(config = CONFIG_FILE) {
	try {
		let file = fs.readFileSync(config);
		return JSON.parse(file);
	} catch (e) {
		if (e.code == "ENOENT") saveConfig({}, config);
		return {};
	}
}

function saveConfig(config = {}, configFile = CONFIG_FILE) {
	fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
}

module.exports = { loadConfig, saveConfig };
