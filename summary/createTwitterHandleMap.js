const fs = require('fs');
const path = require('path');

let twitterLinkJSON = [];
let globalMap = new Map();

const DIRECTORY_PATH = './sessions'

function parseFilesRecursively(directoryPath = './') {
    const files = fs.readdirSync(directoryPath);
  
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);
    
        if (stat.isDirectory()) {
            // Recursively parse files in subdirectory
            parseFilesRecursively(filePath);
        } else {
            // Parse contents of file -> attendees.adoc
            if(filePath.endsWith('attendees.adoc')) {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                console.log(`Parsing file ${filePath}`);
                collectUsernames(fileContents);
            }
        }
    });
  }

function collectUsernames(data) {
    
    /**
     * fileData
     * 
    ==== Attendees

    . link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
    . link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
    . link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
     *
     */
    
    let fileData = data
    .toString()
    .split('\n')
    .slice(2)
    .join('\n');
    
    /**
     * fileData
     * 
    . link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
    . link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
    . link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
     * 
     */
    
    // fileData = fileData.replaceAll('. link:https://twitter.com/', '');
    fileData = fileData.replaceAll('. link:', '');
    fileData = fileData.replaceAll('. ', '');
    fileData = fileData.replaceAll('[', ' ');
    fileData = fileData.replaceAll('^]', '');
    
    /**
     * fileData
     * 
    https://twitter.com/ayushb_tweets Ayush Bhosle
    https://twitter.com/annshagrawaal Annsh Agrawaal 
    https://twitter.com/DhiruCodes Dheeraj Lalwani
     * 
     */

    /**
     * newData - [array of strings]
     * where string = "twitterLink firstName Lastname"
     */
    
    let newData = fileData.split('\n');

    for(let line of newData) {
        let currentLine = line.split(" ");
        if(currentLine[0].startsWith("https://")) {
            let twitterLink = currentLine[0].trim();
            let fullName = currentLine
                        .splice(1)
                        .join(' ')
                        .trim();

            if(!globalMap.has(fullName)) {
                globalMap.set(fullName, twitterLink);
            }
        }
    }
}

function writeToMap() {
    /**
     * NOTE: the forEach syntax
     * forEach((value, key) => {  } )
     * 
     * (not key value; a little unintutive)
     */
    globalMap.forEach((twitterLink, fullName) => {
        twitterLinkJSON.push({
            "name": fullName, 
            "handle": twitterLink
        });
    })
    
    fs.writeFileSync('map.json', JSON.stringify(twitterLinkJSON, null, 4));
}

parseFilesRecursively(DIRECTORY_PATH);
writeToMap();