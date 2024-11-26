// Filename: tokenize15-2.ts -> tokenize15-2.js
// Command line entery to tokenize Sharp PC-1500 BASIC file and add CE-158 header
// Usage - node dist/tokenize15.js fileName.ext outputName
// Usage - node dist/tokenize15.js fileName.pc1500.sbs outFileName
// outFileName truncated to 16 char limit of CE-158 header, .BAS ext. added
// Outputs -     outFileName.bas
// EOL in source CRLF or LF. Tokenized file will have CR line endings.
// 
// By - Hey Birt!

import * as filStrm from 'fs';
import { token152 } from './token15';

const args = process.argv;
args.splice(0,2);                   // removes node and tokenize15 from args

if (args.length < 2) 
{
    console.log("Missing arguments.")
    console.log("USAGE -> node dist/tokenize15.js fileName.ext outputName")
    process.exit();
}

let fileName:string = args[0];
let outFileName = args[1];
type rTuple = [string, Uint8Array]; // tuple used to return file name and data array

//let outName: string = fNameProcess(outFileName);
console.log("tokenize15-2 - processing: " + fileName);

const sourceFile: string = filStrm.readFileSync(fileName, 'utf-8'); // 
let outTuple: rTuple = token152(outFileName, sourceFile);   // We call the token15 module from here

// save binary file
const writeStream = filStrm.createWriteStream(outTuple[0]);
writeStream.write(outTuple[1]);
writeStream.end();

console.log("tokenize15-2 - processing complete. Output file name: " + outTuple[0]);
