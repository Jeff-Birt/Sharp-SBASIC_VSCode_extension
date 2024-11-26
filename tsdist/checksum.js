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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import file stream support
const fs = __importStar(require("fs"));
const crc16_1 = __importDefault(require("crc/crc16"));
// process args passed to node.js. (0)=nodePath, (1)=concatPath
const args = process.argv;
//let outFile: string = args[2];      // grab outout file name
args.splice(0, 2); // remove nodePath and concatPath
//const writeStream = fs.createWriteStream(outFile);
console.log("Checksum started");
//args.forEach((file) => {
//const inData: Uint8Array = fs.readFileSync(args[0]);
//let outData = new Uint8Array(32768);
//console.log("data.length=" + (inData.length-1));
//let check: number = 0;
let check = (0, crc16_1.default)(fs.readFileSync(args[0], 'utf-8'));
// for (let i = 0; i < 32768; i++)
// {
//     check += inData[i];
//     //console.log(i);
// }
console.log('Checksum:' + check.toString());
// const helloWorld = new Int8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
// const result = crc16(helloWorld).toString(16); // Same result:
// console.log(result);
//# sourceMappingURL=checksum.js.map