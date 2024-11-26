// Filename: concat.ts -> concat.js 
// Concatenates #n binary files
// Usage - node tsdist/concat.js outFile.ext f1.bin f2.bin
// Outputs - outfile.ext, file list and DIP SW index for DAR use
// DIP SW   File
// F        f1.bin
// E        f2.bin
// by Hey Birt!

// Import file stream support
import * as fs from 'fs';

// process args passed to node.js. (0)=nodePath, (1)=concatPath
const args = process.argv;
let outFile: string = args[2];      // grab outout file name
args.splice(0,3);                   // remove nodePath and concatPath
    
const writeStream = fs.createWriteStream(outFile);
let index: number = 15;             
// DIP SW position for DAR

console.log("DIP SW   File")
args.forEach((file) => {
    const data = fs.readFileSync(file);
    writeStream.write(data);
    console.log(index.toString(16).toUpperCase() + "        " + file)
    index --;
});

writeStream.end(() => {
    console.log('Files concatenated successfully!');
});