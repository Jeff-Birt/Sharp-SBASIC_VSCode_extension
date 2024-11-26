"use strict";
// Filename: concat.ts -> concat.js 
// Concatenates #n binary files
// Usage - node tsdist/concat.js outFile.ext f1.bin f2.bin
// Outputs - outfile.ext, file list and DIP SW index for DAR use
// DIP SW   File
// F        f1.bin
// E        f2.bin
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
let index = 15;
// DIP SW position for DAR
console.log("DIP SW   File");
args.forEach((file) => {
    const data = fs.readFileSync(file);
    writeStream.write(data);
    console.log(index.toString(16).toUpperCase() + "        " + file);
    index--;
});
writeStream.end(() => {
    console.log('Files concatenated successfully!');
});
//# sourceMappingURL=concat.js.map