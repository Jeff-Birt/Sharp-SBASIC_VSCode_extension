// Filename: checksum.ts -> shecksum.js 
// Generate CRC16 of binary file
// Usage - node tsdist/checksum.js file.bin
// Outputs - text to terminal window
// by Hey Birt!

// Import file stream support
import * as fs from 'fs';
import crc16 from 'crc/crc16';

// process args passed to node.js. (0)=nodePath, (1)=concatPath
const args = process.argv;
//let outFile: string = args[2];      // grab outout file name
args.splice(0,2);                   // remove nodePath and concatPath
//const writeStream = fs.createWriteStream(outFile);

console.log("Checksum started")
//args.forEach((file) => {
//const inData: Uint8Array = fs.readFileSync(args[0]);
//let outData = new Uint8Array(32768);
//console.log("data.length=" + (inData.length-1));

//let check: number = 0;
let check: number = crc16(fs.readFileSync(args[0],'utf-8'));
// for (let i = 0; i < 32768; i++)
// {
//     check += inData[i];
//     //console.log(i);
// }




console.log('Checksum:' + check.toString());


// const helloWorld = new Int8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
// const result = crc16(helloWorld).toString(16); // Same result:
// console.log(result);