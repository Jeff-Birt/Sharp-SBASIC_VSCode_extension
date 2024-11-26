"use strict";
// Filename: 2CR.ts -> 2CR.js
// Converts a text file to CR line endings
//   Usage: node dist/2CR.js file.ext newEXT
//          
// Outputs: file.newEXT
// by Hey Birt!
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
const args = process.argv;
args.splice(0, 2); // remove nodePath and concatPath
let fileName = args[0];
let outName = ""; // output file name
console.log("2CR processing: " + fileName);
let xPos = fileName.lastIndexOf("."); // will be start of file extension
if (xPos == -1) {
    xPos = fileName.length;
} // if no '.'
outName = fileName.slice(0, xPos) + '.' + args[1]; // add new file extension
outName = outName.toUpperCase(); // make file name upper case
const sourceFile = filStrm.readFileSync(fileName, 'utf-8'); // *** for testing
let linesArray = sourceFile.split(/[\r?\n]/); // split source file into array of lines
const writeStream = filStrm.createWriteStream(outName);
let outStr = "";
// String split results in every other array element having 0 length.
// Iterate each array element and throw out all those with 0 length.
for (let i = 0; i < linesArray.length; i++) {
    if (linesArray[i].length > 0) {
        outStr += linesArray[i] + '\r';
    }
}
outStr += '\r'; // PC-1500 needs an extra CR to mark EOF
writeStream.write(outStr);
console.log("2CR processing complete: " + outName);
//# sourceMappingURL=2CR.js.map