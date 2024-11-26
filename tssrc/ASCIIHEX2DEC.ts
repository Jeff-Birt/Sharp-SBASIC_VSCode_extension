// Filename: ASCIIHEX2DEC.ts -> ASCIIHEX2DEC.js
// Converts an ASCII encoded HEX file to decimal
// Usage: node dist/ASCIIHEX2DEC.js fileName.ext newExt
// Output: filename.newExt

import * as filStrm from 'fs';

// Create filename.mlb and find length of bin file
const args = process.argv;
args.splice(0,2);   // remove nodePath and progPath
// *** should trap incorrect or missing args[1]

let outName: string = "";
let fileName: string = args[0]; //"ASCHEX.txt";
console.log("ASCIIHEX2DEC processing: " + fileName);

let xPos: number = fileName.lastIndexOf(".");       // will be start of file extension
if (xPos == -1)  { xPos = fileName.length; }        // if no '.'

outName = fileName.slice(0,xPos) + '.' + args[1];   // add new file extension
outName = outName.toUpperCase();                    // make file name upper case

const data: Uint8Array = filStrm.readFileSync(fileName);
const writeStream = filStrm.createWriteStream(outName);

for (let i = 0; i < data.length; i += 2)
{
    let numStr: string = new TextDecoder().decode(data.subarray(i, i+2));
    let n: number = parseInt(numStr, 16);
    writeStream.write(new Uint8Array([n]));
}

console.log("ASCIIHEX2DEC processing complete: " + outName);