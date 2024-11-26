"use strict";
// Filename: bin2bldr.ts -> bin2bldr.js
// PC-1500 BIN file to BASIC loader script
// Converts a binary file into a BASIC loader program in ASCII format
// Usage: 'node dist/bin2Bldr.js fileName.bin startingAddress' NOTE: Use 0x#### for hex values
// Output: fileName.asc
// by - Hey Birt!
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const filStrm = __importStar(require("fs"));
// Create filename.mlb and find length of bin file
const args = process.argv;
args.splice(0, 2); // remove nodePath and bin2LdrPath
let fileName = args[0];
console.log("bin2Bldr processing: " + fileName);
let startAddress = Number(args[1]);
console.log("Converting " + fileName + " to BASIC loader at address $" + numberToHex(startAddress, 4));
const data = filStrm.readFileSync(fileName);
let len = data.length;
console.log("Length " + len.toString());
let lineInc = 10;
let lineNum = 10;
let line = "";
// Loop through byte aryay in blocks of 8
for (let i = 0; i < len; i += 8) {
    let cnt = 0; // counts num of poke values in line
    let hNum = numberToHex(startAddress, 2);
    line += lineNum.toString() + " POKE &" + hNum;
    lineNum += lineInc;
    // 8 poke values per line
    while (cnt < 8) {
        let index = i + cnt;
        line += ",&" + numberToHex(data[index], 2);
        cnt += 1;
        // end loop early, we hit end of array
        if ((index + 1) == len) {
            cnt = 8;
        }
    }
    startAddress += 8; // Inc the start address for next line
    line += "\r"; // Add a /CR to end of each line
}
line += "\r"; // Add an /CR to end of file as EOF marker
// Seperate filename from extesnion, save filename.asc
let xPos = fileName.lastIndexOf("."); // will be start of file extension
if (xPos == -1) {
    xPos = fileName.length;
} // if no '.'
let outName = fileName.slice(0, xPos) + ".ASC"; // add new file extension
outName = outName.toUpperCase(); // make file name upper case
const writeStream = filStrm.createWriteStream(outName);
writeStream.write(line);
console.log("bin2Bldr processing complete: " + outName);
// Convert number type to hex string with leading zeros
// Swiped from Bing Copilot
function numberToHex(num, length) {
    return num.toString(16).toUpperCase().padStart(length, '0');
}
//# sourceMappingURL=bin2Bldr.js.map