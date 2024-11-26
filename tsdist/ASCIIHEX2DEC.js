"use strict";
// Filename: ASCIIHEX2DEC.ts -> ASCIIHEX2DEC.js
// Converts an ASCII encoded HEX file to decimal
// Usage: node dist/ASCIIHEX2DEC.js fileName.ext newExt
// Output: filename.newExt
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
args.splice(0, 2); // remove nodePath and progPath
// *** should trap incorrect or missing args[1]
let outName = "";
let fileName = args[0]; //"ASCHEX.txt";
console.log("ASCIIHEX2DEC processing: " + fileName);
let xPos = fileName.lastIndexOf("."); // will be start of file extension
if (xPos == -1) {
    xPos = fileName.length;
} // if no '.'
outName = fileName.slice(0, xPos) + '.' + args[1]; // add new file extension
outName = outName.toUpperCase(); // make file name upper case
const data = filStrm.readFileSync(fileName);
const writeStream = filStrm.createWriteStream(outName);
for (let i = 0; i < data.length; i += 2) {
    let numStr = new TextDecoder().decode(data.subarray(i, i + 2));
    let n = parseInt(numStr, 16);
    writeStream.write(new Uint8Array([n]));
}
console.log("ASCIIHEX2DEC processing complete: " + outName);
//# sourceMappingURL=ASCIIHEX2DEC.js.map