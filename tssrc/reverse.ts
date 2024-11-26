// Filename: reverse.ts -> reverse.js 
// Reverse order of a binary file
// Usage - node tsdist/reverse.js outFile.bin file.bin
// Outputs - outfile.bin, reversed version of file.bin
// by Hey Birt!

// Import file stream support
import * as fs from 'fs';

// process args passed to node.js. (0)=nodePath, (1)=concatPath
const args = process.argv;
let outFile: string = args[2];      // grab outout file name
args.splice(0,3);                   // remove nodePath and concatPath
    
const writeStream = fs.createWriteStream(outFile);

console.log("Reverse started")
//args.forEach((file) => {
const inData: Uint8Array = fs.readFileSync(args[0]);
let outData = new Uint8Array(32768);
console.log("data.length=" + (inData.length-1));

for (let i = 0; i < 32768; i++)
{
    outData[(32767-i)] = inData[i];
    //console.log(i);
}

//});
writeStream.write(outData);

//writeStream.end(() => {
    console.log('Reverse done');
//});