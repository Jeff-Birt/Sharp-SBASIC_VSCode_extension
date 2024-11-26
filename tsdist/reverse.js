"use strict";
// Filename: reverse.ts -> reverse.js 
// Reverse order of a binary file
// Usage - node tsdist/reverse.js outFile.bin file.bin
// Outputs - outfile.bin, reversed version of file.bin
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
// Import file stream support
const fs = __importStar(require("fs"));
// process args passed to node.js. (0)=nodePath, (1)=concatPath
const args = process.argv;
let outFile = args[2]; // grab outout file name
args.splice(0, 3); // remove nodePath and concatPath
const writeStream = fs.createWriteStream(outFile);
console.log("Reverse started");
//args.forEach((file) => {
const inData = fs.readFileSync(args[0]);
let outData = new Uint8Array(32768);
console.log("data.length=" + (inData.length - 1));
for (let i = 0; i < 32768; i++) {
    outData[(32767 - i)] = inData[i];
    //console.log(i);
}
//});
writeStream.write(outData);
//writeStream.end(() => {
console.log('Reverse done');
//});
//# sourceMappingURL=reverse.js.map