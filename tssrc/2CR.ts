// Filename: 2CR.ts -> 2CR.js
// Converts a text file to CR line endings
//   Usage: node dist/2CR.js file.ext newEXT
//          
// Outputs: file.newEXT
// by Hey Birt!

import * as filStrm from 'fs';

const args = process.argv;
args.splice(0,2);               // remove nodePath and concatPath

let fileName: string = args[0];
let outName: string = ""; // output file name

console.log("2CR processing: " + fileName);

let xPos: number = fileName.lastIndexOf(".");       // will be start of file extension
if (xPos == -1)  { xPos = fileName.length; }        // if no '.'

outName = fileName.slice(0,xPos) + '.' + args[1];   // add new file extension
outName = outName.toUpperCase();                    // make file name upper case

const sourceFile = filStrm.readFileSync(fileName, 'utf-8'); // *** for testing
let linesArray: string[] = sourceFile.split(/[\r?\n]/)      // split source file into array of lines

const writeStream = filStrm.createWriteStream(outName);
let outStr: string = "";

// String split results in every other array element having 0 length.
// Iterate each array element and throw out all those with 0 length.
for (let i: number = 0; i < linesArray.length; i++)
{
    if (linesArray[i].length > 0)
    {
        outStr += linesArray[i] + '\r'
    }
}

outStr += '\r'; // PC-1500 needs an extra CR to mark EOF
writeStream.write(outStr);

console.log("2CR processing complete: " + outName);
