"use strict";
// Filename: tokenize15-2.ts -> tokenize15-2.js
// Command line entery to tokenize Sharp PC-1500 BASIC file and add CE-158 header
// Usage - node dist/tokenize15.js fileName.ext outputName
// Usage - node dist/tokenize15.js fileName.pc1500.sbs outFileName
// outFileName truncated to 16 char limit of CE-158 header, .BAS ext. added
// Outputs -     outFileName.bas
// EOL in source CRLF or LF. Tokenized file will have CR line endings.
// 
// By - Hey Birt!
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
const token15_1 = require("./token15");
const args = process.argv;
args.splice(0, 2); // removes node and tokenize15 from args
if (args.length < 2) {
    console.log("Missing arguments.");
    console.log("USAGE -> node dist/tokenize15.js fileName.ext outputName");
    process.exit();
}
let fileName = args[0];
let outFileName = args[1];
//let outName: string = fNameProcess(outFileName);
console.log("tokenize15-2 - processing: " + fileName);
const sourceFile = filStrm.readFileSync(fileName, 'utf-8'); // 
let outTuple = (0, token15_1.token152)(outFileName, sourceFile); // We call the token15 module from here
// save binary file
const writeStream = filStrm.createWriteStream(outTuple[0]);
writeStream.write(outTuple[1]);
writeStream.end();
console.log("tokenize15-2 - processing complete. Output file name: " + outTuple[0]);
//# sourceMappingURL=tokenize15.js.map