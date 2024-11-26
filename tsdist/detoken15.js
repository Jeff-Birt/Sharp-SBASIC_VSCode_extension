"use strict";
// Filename: detoken15.ts -> detoken15.js
// PC-1500 SBASIC Detokenization
// Analyizes a file tries to determine if it is a EPROM dump, progam save, etc.
// Looks for presence and location of reserve memory, BASIC program, etc.
// Usage - deToken15 fileName.ext [options]
//       -I save info file as fileName_Info.txt
//       -D Detokenize BASIC code save file as fileName.ASC
//       -R Dump reserve file as fileName_Res.txt
// Outputs - Texts files based on options above
// Line numbers and Keywords much be space delimeted in source file
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
exports.fileInfo15 = fileInfo15;
// COM file structure:
// 0x0000-0x001A   - CE-158 (COM) header (bytes 0x26)
// 0x001B-0x0022   - ROM header		     (bytes 0x07)
// 0x0023-0x00DF   - Reserve memory area (bytes 0xBC) {may not exist, test w.r.t. start of BASIC file}
// 0x00E0~         - BASIC program code	
// Program structure:
// 0x0000-0x0007   - ROM header		     (bytes 0x07)
// 0x0008-0x00C4   - Reserve memory area (bytes 0xBC) {may not exist, test w.r.t. start of BASIC file}
// 0x00C5~         - BASIC program code
// ROM Header:
// BYTE 0 - 55H Marker BYTE
// BYTE 1 - HB of ROM top address
// BYTE 2 - HB of top of BASIC program
// BYTE 3 - LB of top of BASIC program
// BYTE 4 - ROM size: 04=1K, 08=2K. 10=4K, 20=8K, 40=16K
// BYTE 5 - undefined
// BYTE 6 - undefined
// BYTE 7 - 0xFF Prevent LIST, 0x00 allow list
// Deocde COM header, 27 bytes long
// Is first byte 0x01? 
//   Yes, may be COM header. 
//   No skip to check for ROM header
// Do bytes 1-4 match @COM, ACOM, BCOM, HCOM? Yes then has header. If not @COM then not a BASIC file. Quit.
// Bytes 5-20 filename padded with trailing 0x00
// Bytes 21-22 start address (HB LB). Not important for BASIC
// Bytes 23-24 length (HB LB), not including header
// Bytes 25-26 don't care
//
// Decode ROM header - 
// Byte 0 0x55? Could be ROM header
// BYTE 1   - HB of ROM top address
// BYTE 2-3 - (HB LB) Top of BASIC program
// BYTE 4   - ROM size: 04=1K, 08=2K. 10=4K, 20=8K, 40=16K
// BYTE 5-6 - undefined
// BYTE 7 -   0xFF Prevent LIST, 0x00 allow list
const filStrm = __importStar(require("fs"));
// PC-1500 BASIC keywords
let keywordArray = ["ABS", "ACS", "AND", "AREAD", "ARUN", "ASC", "ASN", "ATN",
    "BEEP", "BREAK",
    "CALL", "CHAIN", "CHR$", "CLEAR", "CLOAD", "CLS", "COM$", "CONSOLE", "CONT", "COLOR", "COS", "CSAVE", "CSIZE", "CURSOR",
    "DATA", "DEG", "DEGREE", "DEV$", "DIM", "DMS", "DTE",
    "END", "ERL", "ERN", "ERROR", "EXP",
    "FEED", "FOR",
    "GCURSOR", "GLCURSOR", "GOSUB", "GOTO", "GPRINT", "GRAD", "GRAPH",
    "IF", "INKEY$", "INPUT", "INSTAT", "INT",
    "LCURSOR", "LEFT$", "LEN", "LET", "LF", "LINE", "LIST", "LLIST", "LN", "LOCK", "LOG", "LPRINT",
    "MEM", "MERGE", "MID$",
    "NEW", "NEXT", "NOT",
    "OFF", "ON", "OPN", "OR", "OUTSTAT",
    "PAUSE", "PEEK", "PEEK#", "PI", "POINT", "POKE", "POKE#", "PRINT",
    "RADIAN", "RANDOM", "READ", "REM", "RESTORE", "RETURN", "RIGHT$", "RINKEY$", "RLINE", "RMT", "RND", "ROTATE", "RUN",
    "SETCOM", "SETDEV", "SGN", "SIN", "SORGN", "SPACE$", "SQR", "STATUS", "STEP", "STOP", "STR$",
    "TAB", "TAN", "TERMINAL", "TEST", "TEXT", "THEN", "TIME", "TO", "TRANSMIT", "TROFF", "TRON",
    "UNLOCK", "USING",
    "VAL",
    "WAIT",
    "ZONE"];
// PC-1500 BASIC keyword tokens. In same order as keywords.
let tokenArray = new Uint16Array([0xF170, 0xF174, 0xF150, 0xF180, 0xF181, 0xF160, 0xF173, 0xF175,
    0xF182, 0xF0B3,
    0xF18A, 0xF0B2, 0xF163, 0xF187, 0xF089, 0xF088, 0xE858, 0xF0B1, 0xF183, 0xF0B5, 0xF17E, 0xF095, 0xE680, 0xF084,
    0xF18D, 0xF165, 0xF18C, 0xE857, 0xF18B, 0xF166, 0xE884,
    0xF18E, 0xF053, 0xF052, 0xF1B4, 0xF178,
    0xF0B0, 0xF1A5,
    0xF093, 0xE682, 0xF194, 0xF192, 0xF09F, 0xF186, 0xE681,
    0xF196, 0xF15C, 0xF091, 0xE859, 0xF171,
    0xE683, 0xF17A, 0xF164, 0xF198, 0xF0B6, 0xF0B7, 0xF090, 0xF0B8, 0xF176, 0xF1B5, 0xF177, 0xF0B9,
    0xF158, 0xF08F, 0xF17B,
    0xF19B, 0xF19A, 0xF16D,
    0xF19E, 0xF19C, 0xF19D, 0xF151, 0xE880,
    0xF1A2, 0xF16F, 0xF16E, 0xF15D, 0xF168, 0xF1A1, 0xF1A0, 0xF097,
    0xF1AA, 0xF1A8, 0xF1A6, 0xF1AB, 0xF1A7, 0xF199, 0xF172, 0xE85A, 0xF0BA, 0xE7A9, 0xF17C, 0xE685, 0xF1A4,
    0xE882, 0xE886, 0xF179, 0xF17D, 0xE684, 0xF061, 0xF16B, 0xF167, 0xF1AD, 0xF1AC, 0xF161,
    0xF0BB, 0xF17F, 0xE883, 0xF0BC, 0xE686, 0xF1AE, 0xF15B, 0xF1B1, 0xE885, 0xF1B0, 0xF1AF,
    0xF1B6, 0xF085,
    0xF162,
    0xF1B3,
    0xF0B4]);
// Create class to use as a struct and hold important file info
class FileInfo {
    fileName;
    sourceFile;
    decode = false;
    fileType = "";
    progName = "";
    stAddress = 0;
    progLen = 0;
    topROM = 0;
    topBASIC = 0;
    romSize = 0;
    listOK = false;
    saveInfo = false; // -I save info file as fileName_Info.txt
    detoke = false; // -D Detokenize BASIC code save file as fileName.ASC
    rDump = false; // -RB Dump reserve file as binary file
    rTxt = false; // -RT Dump Reserve memory as decoded text
    comHeader = ""; // holds decoded COM header
    romHeader = ""; // holds decoded ROM header
    resMem = ""; // holds Reserve Memory
    basTxt = ""; // BASIC file detokenized to plain text
    constructor(fileName, sourceFile) {
        this.fileName = fileName;
        this.sourceFile = sourceFile;
    }
}
// Decodes COM &| ROM header dumps Reserve memory and detokenizes if a BASIC file.
function fileInfo15(file, option) {
    let fInfo = new FileInfo(file, filStrm.readFileSync(file));
    let typeStr = "";
    let index = 0;
    if (fInfo.sourceFile[0] == 0x01) {
        fInfo.comHeader = decodeCOMHeader(index, fInfo);
    }
    if (fInfo.sourceFile[0] == 0x55) {
        fInfo.romHeader = decodeROMHeader(index, fInfo, "\nROM Dump");
    }
    // Concatenate all file data
    typeStr = fInfo.comHeader + "\n";
    typeStr += fInfo.romHeader + "\n";
    typeStr += fInfo.resMem + "\n";
    typeStr += fInfo.basTxt + "\n";
    switch (option) {
        case "-RB":
            { // dump reserve memory binary
                fInfo.rDump = true;
                typeStr = fInfo.resMem;
            }
        case "-RT":
            { // dump reserve memory decoded text
                fInfo.rTxt = true;
                typeStr = fInfo.resMem;
            }
        case "-D":
            { // Detokenize BASIC file
                fInfo.detoke = true;
                typeStr = fInfo.basTxt;
            }
    }
    return typeStr;
}
// Detokenizes a PC-1500 BASIC file
function deToken15(data, index) {
    let eol = 0; // data.indexOf(0x0D, index+3); // +3 to 
    let dPoint = index; // points to current locaito in data buffer
    let prgOut = ""; // program in ASCII
    let lineNum = 0;
    // dPoint is Start of line, line goes from dPoint to dPoint+eol
    while (dPoint < data.length) {
        eol = data.indexOf(0x0D, dPoint + 3); // +3 to get past line# and len
        lineNum = data[dPoint] * 256 + data[dPoint + 1];
        let lineLen = data[dPoint + 2]; //
        let lineLenOK = (eol - (dPoint + 2 + lineLen)) == 0; // check lineLen against eol
        // console.log("dPoint: " + dPoint + ", eol: " + eol + ", Line #" + lineNum + 
        //     ", len: " + lineLen + ", valid? " + lineLenOK);
        if (lineNumValid(lineNum) == true && lineLenOK) {
            prgOut += lineNum.toString() + " "; // add line # to output line string
            dPoint += 3; // move past line # and line length
            // line from dPoint to eol
            while (dPoint < eol) {
                // If 1st byte is Ex or Fx we have a token, decode add to line string
                let tok = data[dPoint] * 256 + data[dPoint + 1];
                if (tok >= 0xE000 && tok < 0xFFFF) {
                    prgOut += keywordArray[tokenArray.indexOf(tok)] + " ";
                    dPoint += 2; // next byte past token
                }
                else if (tok == 0xFFFF) {
                    dPoint = eol; // endof file
                }
                else // Not token? Assume litteral, convert to ASCII
                 {
                    prgOut += new TextDecoder().decode(data.subarray(dPoint, dPoint + 1));
                    dPoint += 1; // next byte past litteral
                }
            }
            prgOut += "\n";
            dPoint += 1;
        }
        else // reached end of BASIC
         {
            dPoint = data.length;
        }
    }
    //console.log(prgOut);
    return prgOut;
}
// Decode the COM header, decode ROM header if present
function decodeCOMHeader(index, fInfo) {
    fInfo.decode = false;
    fInfo.fileType = fInfo.sourceFile.subarray(1, 5).toString();
    fInfo.progName = fInfo.sourceFile.subarray(5, 21).toString();
    fInfo.stAddress = fInfo.sourceFile[21] * 256 + fInfo.sourceFile[22];
    fInfo.progLen = fInfo.sourceFile[23] * 256 + fInfo.sourceFile[24];
    // @COM=BASIC, ACOM=RESERVE, BCOM=ML, HCOM=PRINT#
    let typeStr = "";
    typeStr = "Program Name: " + fInfo.progName +
        ", Starting Address: " + fInfo.stAddress.toString(16).padStart(4, '0').toUpperCase() +
        ", Program Length: " + fInfo.progLen.toString(16).padStart(4, '0').toUpperCase() + "\n";
    if (fInfo.fileType == "BCOM") {
        typeStr = "COM File Header, Type: " + fInfo.fileType + ", " + "ML file or dump\n" + typeStr;
        index = 27; // look for ROM header
        fInfo.romHeader = decodeROMHeader(index, fInfo, "");
    }
    else if (fInfo.fileType == "@COM") {
        typeStr = "\nCOM File Header, Type: " + fInfo.fileType + ", " + "BASIC file\n" + typeStr;
        index = 27; // look for ROM header
        let lineLen = fInfo.sourceFile[index + 2]; // line length byte
        let lineLenOK = (lineLen - fInfo.sourceFile.indexOf(0x0D, index + 3)) != 0;
        typeStr += "1st BASIC line#: " + getLineNum(fInfo.sourceFile.subarray(index, index + 2)) +
            ", In range? " + lineNumValid(getLineNum(fInfo.sourceFile.subarray(index, index + 2))) +
            ", Length: " + lineLen + ", Verified? " + lineLenOK + "\n";
        //console.log(typeStr);
        fInfo.basTxt = deToken15(fInfo.sourceFile, 27);
    }
    else if (fInfo.fileType == "ACOM") {
        typeStr = "RESERVE file";
    }
    else {
        typeStr = "Unknown file";
    }
    return typeStr;
}
// Decode the ROM header
//function decodeROMHeader(sourceFile: Buffer, index: number, preStr: string)
function decodeROMHeader(index, fInfo, preStr) {
    let typeStr = "";
    // If there is a ROM header
    if (fInfo.sourceFile[index] == 0x55) {
        fInfo.topROM = fInfo.sourceFile[index + 1] * 256;
        fInfo.topBASIC = fInfo.sourceFile[index + 2] * 256 + fInfo.sourceFile[index + 3] + index;
        fInfo.romSize = fInfo.sourceFile[index + 4] * 256;
        fInfo.listOK = fInfo.sourceFile[index + 7] > 0;
        typeStr = preStr + "\nROM header" + "\nTop ROM: " + fInfo.topROM.toString(16).padStart(2, '0').toUpperCase() +
            ", ROM Size: " + fInfo.romSize.toString(16).padStart(4, '0').toUpperCase() +
            "\nTop BASIC: " + fInfo.topBASIC.toString(16).padStart(4, '0').toUpperCase() +
            ((fInfo.topBASIC != (0xC5 + index)) ? ", non-" : ", ") + "standard location.";
        let lineLen = fInfo.sourceFile[fInfo.topBASIC + 2]; //
        let lineLenOK = (lineLen - fInfo.sourceFile.indexOf(0x0D, fInfo.topBASIC + 2)) != 0;
        typeStr += "\n1st BASIC line#: " + getLineNum(fInfo.sourceFile.subarray(fInfo.topBASIC, fInfo.topBASIC + 2)) +
            ", In range? " + lineNumValid(getLineNum(fInfo.sourceFile.subarray(fInfo.topBASIC, fInfo.topBASIC + 2))) +
            ", Length: " + lineLen + ", Verified? " + lineLenOK + ", Can list? " + fInfo.listOK + "\n";
        typeStr += "\nDump of Reserve Memory Area" + (fInfo.topBASIC < (0x08 + index + 0xBC) ? ", Valid?" : "");
        // *** add further decoding step to plain text as option
        fInfo.resMem = hexDump(fInfo.sourceFile, 0x08 + index, 0xBC);
        console.log(fInfo.resMem);
        if (lineLenOK) {
            fInfo.basTxt = deToken15(fInfo.sourceFile, fInfo.topBASIC);
        }
    }
    return typeStr;
}
// Convert a value stored in n bytes into a number
function getLineNum(data) {
    let val = 0; // 0 indicates failed conv to #
    for (let i = 0; i < data.length; i++) {
        val += data[i] * (Math.pow(2, (data.length - i - 1) * 4));
    }
    return val;
}
// Returns true if this is a value line number
function lineNumValid(lineNum) {
    return (lineNum > 0 && lineNum < 65536);
}
// ----------------------------------------------------------------------------
// Can be called from external code too
// export function fileInfo15(fileName: string): Uint8Array
// {
//     // The string split will leave lines of zero length
//     const sourceFile = filStrm.readFileSync(fileName, 'utf-8'); // 
//     let linesArray: string[] = sourceFile.split(/[\r]/)      // split source file into array of lines
//     let outputArray = new Uint8Array(0x10000);                  // <= 16K
//     fileName = fileName.toUpperCase();                          // make file name upper case
//     if (fileName.lastIndexOf(".BAS") > 1)
//     {
//         fileName = fileName.replace(".BAS", ".ASC")
//     }
//     else 
//     {
//         let xPos: number = fileName.lastIndexOf(".");           // will be start of file extension
//         if (xPos == -1) 
//             { xPos = fileName.length; }                         // if no '.'
//         fileName = fileName.slice(0,xPos) + ".ASC";             // add new file extension
//     }
//     let outName = fileName;                                     //           
//     let i: number = 0;          // statement loop
//     let j: number = 0;          // segment loop
//     let oaIndex: number = 0;    // output array index
//     const encoder = new TextEncoder();
//     for (let l = 0; l < linesArray.length; l++) // lines loop
//     {
//         let outputLine = new Uint8Array(80);    // one line of encoded BASIC termianed with /CR
//         let olIndex: number = 0;                // index of next free byte in outputLine
//         // Split lines on colon into statements
//         let str: string = linesArray[l];
//         if (str != '') 
//         {
//             let statement: string[] = str.split(/:+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
//             for (i = 0; i < statement.length; i++) // statement loop
//             {
//                 // Split statements on space into segments
//                 let stat: string = statement[i];
//                 let segment: string [] = stat.split(/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
//                 for (j = 0 ; j < segment.length; j++) // segment loop
//                 {
//                     if ((i == 0) && (j == 0)) 
//                     {
//                         //Trap missing line number
//                         let returnedVal: number = Number(segment[0]);
//                         let result: boolean = isNaN(returnedVal);
//                         if (result != true)
//                         {               
//                             outputLine.set([(returnedVal >> 8)], olIndex++);    // upper byte
//                             outputLine.set([(returnedVal & 0xFF)], olIndex++);  // lower byte  
//                             outputLine.set([32], olIndex++ );                   // place holder                                         
//                         }
//                         else 
//                         {
//                             j = segment.length;
//                         }
//                     }
//                     else 
//                     {
//                         // If segment is keyword find token 
//                         let index: number = keywordArray.indexOf(segment[j]);
//                         if (index > 0)
//                         {
//                             let tok: number = tokenArray[index];        // token hex value
//                             outputLine.set([(tok >> 8)], olIndex++ );   // upper byte
//                             outputLine.set([(tok & 0xFF)],olIndex++ );  // lower byte 
//                             // If this is a REM statement find where it is in the line
//                             // copy all after REM verbatium until EOL
//                             if (segment[j] == 'REM')
//                             {
//                                 index = str.indexOf('REM');
//                                 j = segment.length;
//                                 i = statement.length;
//                                 let temp: string = str.substring(index+3,str.length - 1);
//                                 outputLine.set(encoder.encode(temp), olIndex);
//                                 olIndex += temp.length;     // inc index by string length
//                             }
//                         }
//                         else 
//                         {
//                             // Not a keyword so copy verbatium
//                             outputLine.set(encoder.encode(segment[j]), olIndex);
//                             olIndex += segment[j].length;   // inc index by segmetn length
//                         }
//                     }
//                 } // segment loop
//                 outputLine.set(encoder.encode(':'), olIndex++ );
//             } // statement loop
//             // No output on empty lines. 
//             // On valid lines EOL will replace last : added above
//             if (outputLine.length > 1)
//             {
//                 outputLine.set([0x0D], olIndex-1);                              // end of line        
//                 let lineLength: number = olIndex;                               // calcualte line length
//                 outputLine[2] = (lineLength & 0xFF);                            // set line length byte
//                 outputArray.set(outputLine.subarray(0, lineLength), oaIndex);   // copy line to array
//                 oaIndex += lineLength;
//                 // console.log("outputLine " + buf2hex(outputLine.subarray(0, lineLength)));
//             }
//         }
//     } // lines loop
//     header158(outName, "-BAS", outputArray.subarray(0, oaIndex), 0);
//     return outputArray.subarray(0, oaIndex);
// }
// buffer is an ArrayBuffer
function buf2hex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join(',');
}
// Hex editor type screen dump
// Displays from index to index+length, adjusted for 16-byte boundries. 
function hexDump(data, index, length) {
    let hexStr = "";
    let ascStr = "";
    let indStr = "";
    let strFmt = "";
    let fmtReset = "\x1b[0m";
    let fmtBlue = "\x1b[34m";
    let fmtDim = "\x1b[2m";
    let startIndex = Math.floor(index / 16) * 16;
    let endIndex = Math.ceil((index + length) / 16) * 16;
    let typeStr = "index: " + index + ", length: " + length + "\n";
    //console.log("index: " + index + ", length: " + length);
    //console.log(fmtBlue + "Index  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F   Decoded Text" + fmtReset);
    typeStr += fmtBlue + "Index  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F   Decoded Text\n" + fmtReset;
    for (let i = startIndex; i < endIndex; i += 16) {
        hexStr = "";
        ascStr = "";
        indStr = fmtBlue + i.toString(16).padStart(4, '0').toUpperCase() + ":" + fmtReset;
        for (let j = 0; j < 16; j++) {
            strFmt = "";
            if ((i + j) < index || (i + j) > (index + length)) {
                strFmt = fmtDim;
            }
            hexStr += strFmt + buf2hex(data.subarray((i + j), (i + j + 1))).toUpperCase() + " " + fmtReset;
            ascStr += strFmt;
            ascStr += (data[i + j] > 32 && data[i + j] < 127) ? String.fromCharCode(data[i + j]) + " " : ". ";
            ascStr += fmtReset;
        }
        //console.log(indStr + "  " + hexStr + "  " + ascStr);
        typeStr += indStr + "  " + hexStr + "  " + ascStr + "\n";
    }
    //console.log("");
    //console.log(typeStr);
    return typeStr;
}
//# sourceMappingURL=detoken15.js.map