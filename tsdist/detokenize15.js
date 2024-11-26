"use strict";
// Filename: detokenize15.ts -> detokenize15.ss
// Command line entery to detokenize Sharp PC-1500 BASIC file and add decode headers
// Analyizes a file tries to determine if it is a EPROM dump, progam save, etc.
// Looks for presence and location of reserve memory, BASIC program, etc.
// Usage - deTokenize15 fileName.ext [options]
//       -I save info file as fileName_Info.txt
//       -D Detokenize BASIC code save file as fileName.ASC
//       -R Dump reserve file as fileName_Res.txt
// Outputs - Texts files based on options above
// 
// By - Hey Birt!
Object.defineProperty(exports, "__esModule", { value: true });
const detoken15_1 = require("./detoken15");
const args = process.argv;
args.splice(0, 2); // removes node and detokenize15 from args
let fileName = args[0];
console.log("tokenize15 - processing: " + fileName);
//let outTuple: rTuple = fileInfo15(fileName);   // We call the token15 module from here
let result = (0, detoken15_1.fileInfo15)(fileName, args[1]); // We call the token15 module from here
console.log(result);
// save binary file
//const writeStream = filStrm.createWriteStream(outTuple[0]);
//writeStream.write(outTuple[1]);
//writeStream.end();
console.log("tokenize15 - processing complete");
//# sourceMappingURL=detokenize15.js.map