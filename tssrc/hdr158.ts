// Filename: hdr158.ts -> hdr158.js
// Adds CE-158(X) header to file so it be loaded by CE-158(X)
//   Usage: node dist/hdr158.js file.ext -type [0x(address)]
//      ML: node dist/hdr158.js file.bin -bin 0x7C01
//     BAS: node dist/hdr158.js file.tmp -bas
//     RSV: node dist/hdr158.js file.tmp -rsv
//    Func: header158(fName: string, type: string, data: Uint8Array, address?: number): void
//
// Outputs: - tuple [fileName.bas, uint8Array]
// by Hey Birt!

//import * as filStrm from 'fs';

let fName: string =  "";                   // file name
let type: string = "";                     // file type bin, bas, rsv
let outName: string = "";                  // output file name
let outExt: string = "";                   // temp hold new file extension
let address: number = 0;                   // starting address
let marker: number = 32;                   // file type marker

type rTuple = [string, Uint8Array];

//-----------------------------------------------------------------------------
//
export function header158(fName: string, type: string, data: Uint8Array, address?: number): rTuple
{   
    console.log("header158 - processing: " + fName);

    if (typeof address == 'undefined') { address = 0x2000; } // default value

    if (type == '-bin')
    {
        outExt = ".mlb";                           // new file extension
        marker = 0x42                              // the B in BCOM
    }
    else if (type == '-bas')
    {
        outExt = ".bas";                           // new file extension      
        marker = 0x40                              // the @ in @COM
    }
    else if (type == '-rsv')
    {       
        outExt = ".rsv";                           // new file extension        
        marker = 0x41                              // the A in ACOM
    }


    if (fName.length > 13) 
        { fName = fName.slice(0, 12); }             // trim name if too long 12.3

    let xPos: number = fName.lastIndexOf(".");      // will be start of file extension
    if (xPos == -1) 
        { xPos = fName.length;}                     // if no '.'

    outName = fName.slice(0,xPos) + outExt;         // add new file extension
    outName = outName.toUpperCase();                // make file name upper case

    // CE-158 type, @COM=BASIC, ACOM=RESERVE, BCOM=ML
    // Add 0x01 marker and 'BCOM' type, pad name with 0x00
    const encoder = new TextEncoder();
    let header = new Uint8Array(0x1B + data.length);              // 27 bytes of 0x00
    header.set([0x01,marker,0x43,0x4f,0x4D]);       // 0x01,BCOM or @COM or ACOM
    header.set(encoder.encode(outName), 5)          // filename + ext 12.3

    // Convert address to seperate H/L bytes and add to header
    header.set([(address >> 8)], 21);               // upper byte
    header.set([(address & 0xFF)],22)               // lower byte                                    

    // Convert file length to seperate H/L bytes and add to header
    let fLen: number = data.length - 1;             // file name length
    header.set([(fLen >> 8)], 23);                  // upper byte
    header.set([(fLen & 0xFF)], 24);                // lower byte   
    header.set(data,27);                            // add passed in data after header

    console.log("header158 - processing complete");
    return [outName, header];
}