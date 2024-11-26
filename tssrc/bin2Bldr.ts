// Filename: bin2bldr.ts -> bin2bldr.js
// PC-1500 BIN file to BASIC loader script
// Converts a binary file into a BASIC loader program in ASCII format
// Usage: 'node dist/bin2Bldr.js fileName.bin startingAddress' NOTE: Use 0x#### for hex values
// Output: fileName.asc
// by - Hey Birt!

import * as filStrm from 'fs';

// Create filename.mlb and find length of bin file
const args = process.argv;
args.splice(0,2);          // remove nodePath and bin2LdrPath


let fileName: string = args[0];
console.log("bin2Bldr processing: " + fileName);

let startAddress: number = Number(args[1]);
console.log("Converting " + fileName + " to BASIC loader at address $" +  numberToHex(startAddress, 4));

const data = filStrm.readFileSync(fileName);

let len: number = data.length;
console.log("Length " + len.toString());

let lineInc: number = 10;
let lineNum: number = 10;
let line: string = "";

// Loop through byte aryay in blocks of 8
for (let i = 0; i < len; i+=8) 
{
    let cnt: number = 0; // counts num of poke values in line
    let hNum: string = numberToHex(startAddress, 2);
    line += lineNum.toString() + " POKE &" + hNum;
    lineNum += lineInc;

    // 8 poke values per line
    while ( cnt < 8)
    {
        let index: number = i + cnt
        line += ",&" + numberToHex(data[index],2);
        cnt += 1;

        // end loop early, we hit end of array
        if ((index + 1) == len) 
            {cnt = 8}
    }

    startAddress += 8           // Inc the start address for next line
    line += "\r"                // Add a /CR to end of each line
}

line += "\r"                        // Add an /CR to end of file as EOF marker

// Seperate filename from extesnion, save filename.asc
let xPos: number = fileName.lastIndexOf(".");           // will be start of file extension
if (xPos == -1) 
    { xPos = fileName.length;}                          // if no '.'
let outName: string = fileName.slice(0,xPos) + ".ASC";  // add new file extension
outName = outName.toUpperCase();                        // make file name upper case

const writeStream = filStrm.createWriteStream(outName);
writeStream.write(line);
console.log("bin2Bldr processing complete: " + outName);

// Convert number type to hex string with leading zeros
// Swiped from Bing Copilot
function numberToHex(num: number, length: number): string 
{
    return num.toString(16).toUpperCase().padStart(length, '0');
}


