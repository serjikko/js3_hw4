const fs = require('fs');
const { Transform } = require('stream');

const inputFile = process.argv[2];
const outputFile = 'output.json';

const wordCountStream = new Transform({
    transform(chunk, encoding, callback) {
        const text = chunk.toString();
        const words = text
            .split(/\s+/)
            .map(word => word.replace(/[^\w]/g, ''))
            .filter(Boolean);
        
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        const sortedWords = Object.keys(wordCount).sort();
        const resultArray = sortedWords.map(word => wordCount[word]);
        
        this.push(JSON.stringify(resultArray));
        callback();
    }
});

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

readStream.pipe(wordCountStream).pipe(writeStream);