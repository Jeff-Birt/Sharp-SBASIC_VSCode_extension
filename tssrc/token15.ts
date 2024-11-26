// Filename: token15.ts -> token15.js
// PC-1500 SBASIC Tokenizer script
// Functions called by tokenize15.js 
// Filename will be truncated to fit 16 char limit of CE-158 header
// Outputs - uint8Array
// EOL in source CRLF or LF. Tokenized file will have CR line endings.
// 
// By - Hey Birt!

import * as filStrm from 'node:fs';
import { header158 } from './hdr158';

// PC-1500 BASIC keywords
let keywordArray: string[] = ["ABS","ACS","AND","AREAD","ARUN","ASC","ASN","ATN",
    "BEEP","BREAK",
    "CALL","CHAIN","CHR$","CLEAR","CLOAD","CLS","COM$","CONSOLE","CONT","COLOR","COS","CSAVE","CSIZE","CURSOR",
    "DATA","DEG","DEGREE","DEV$","DIM","DMS","DTE",
    "END","ERL","ERN","ERROR","EXP",
    "FEED","FOR",
    "GCURSOR","GLCURSOR","GOSUB","GOTO","GPRINT","GRAD","GRAPH",
    "IF","INKEY$","INPUT","INSTAT","INT",
    "LCURSOR","LEFT$","LEN","LET","LF","LINE","LIST","LLIST","LN","LOCK","LOG","LPRINT",
    "MEM","MERGE","MID$",
    "NEW","NEXT","NOT",
    "OFF","ON","OPN","OR","OUTSTAT",
    "PAUSE","PEEK","PEEK#","PI","POINT","POKE","POKE#","PRINT",
    "RADIAN","RANDOM","READ","REM","RESTORE","RETURN","RIGHT$","RINKEY$","RLINE","RMT","RND","ROTATE","RUN",
    "SETCOM","SETDEV","SGN","SIN","SORGN","SPACE$","SQR","STATUS","STEP","STOP","STR$",
    "TAB","TAN","TERMINAL","TEST","TEXT","THEN","TIME","TO","TRANSMIT","TROFF","TRON",
    "UNLOCK","USING",
    "VAL",
    "WAIT",
    "ZONE"];

// PC-1500 BASIC keyword tokens. In same order as keywords.
let tokenArray = new Uint16Array([0xF170,0xF174,0xF150,0xF180,0xF181,0xF160,0xF173,0xF175,
                                0xF182,0xF0B3,
                                0xF18A,0xF0B2,0xF163,0xF187,0xF089,0xF088,0xE858,0xF0B1,0xF183,0xF0B5,0xF17E,0xF095,0xE680,0xF084,
                                0xF18D,0xF165,0xF18C,0xE857,0xF18B,0xF166,0xE884,
                                0xF18E,0xF053,0xF052,0xF1B4,0xF178,
                                0xF0B0,0xF1A5,
                                0xF093,0xE682,0xF194,0xF192,0xF09F,0xF186,0xE681,
                                0xF196,0xF15C,0xF091,0xE859,0xF171,
                                0xE683,0xF17A,0xF164,0xF198,0xF0B6,0xF0B7,0xF090,0xF0B8,0xF176,0xF1B5,0xF177,0xF0B9,
                                0xF158,0xF08F,0xF17B,
                                0xF19B,0xF19A,0xF16D,
                                0xF19E,0xF19C,0xF19D,0xF151,0xE880,
                                0xF1A2,0xF16F,0xF16E,0xF15D,0xF168,0xF1A1,0xF1A0,0xF097,
                                0xF1AA,0xF1A8,0xF1A6,0xF1AB,0xF1A7,0xF199,0xF172,0xE85A,0xF0BA,0xE7A9,0xF17C,0xE685,0xF1A4,
                                0xE882,0xE886,0xF179,0xF17D,0xE684,0xF061,0xF16B,0xF167,0xF1AD,0xF1AC,0xF161,
                                0xF0BB,0xF17F,0xE883,0xF0BC,0xE686,0xF1AE,0xF15B,0xF1B1,0xE885,0xF1B0,0xF1AF,
                                0xF1B6,0xF085,
                                0xF162,
                                0xF1B3,
                                0xF0B4]);

// Tokenizing modes
enum Mode 
{
    LineNum,    // searching for line numbers
    Symbol,     // searchig for " or character for Quote or Keyword mode entry
    KeyVar,     // Beinnign character of possible keyword found
    REMQte,     // REM statement or beginning of " quote found
    Error       // A parsing error occured
}

// let data: string = "10 \"A\":REM   Par. Res/Ser. Cap\r\n" + "20 CLEAR\r" + "30 R=0\r" +
//                 "40 INPUT\"P.RES/S.CAP:\";R\r" + "50 IF R=0 GOTO 80\r" + "60T=T+1/R\r" +
//                 "70 GOTO 30\r" + "80 A=1/T\r" + "90 PRINT \"VALUE=\";A\r" + "100 GOTO 20\r";
let stIndex: number = 0;

let outputArray = new Uint8Array(4000);     // 16k buffer for tokenized output
let oaHead: number = 0;                     // start of new line in ouputArray
let oaIndex: number = 0;                    // index of next free byte in outputArray
let searchMode: Mode = Mode.LineNum;        // start out searching for line #
let numFound: number = -1;                  // flag start of line # found

type rTuple = [string, Uint8Array];         // output file name and array
//token152(data);

// ----------------------------------------------------------------------------
// Tokenizes plain text file passed, calls hdr15 to add CE-158 header
export function token152(fileName: string, data: string): rTuple
{
    console.log("token15-2 - processing " + fileName);
    //let outName = fNameProcess(fileName);                       // get output file name  
    let outName = fileName                  // get output file name

    for (let i: number = 0; i < data.length; i++)
    {       
        let nxtChAsc: number = data.charCodeAt(i);

        // Look for line# at start of line. Search until 1st non-number char found
        if (searchMode == Mode.LineNum)
        {
            if (((nxtChAsc >= 0x30) && (nxtChAsc <= 0x39)) && (numFound == -1))
            {
                // If we found a number save its location (start of number)
                numFound = i;
            }
            else if (i-stIndex > 4 && numFound == -1)
            {
                // We did not find # in first 5 bytes (0-4), ERROR *** implement
                console.log("Missing or incorrect line #");
            }
            else if ((nxtChAsc < 0x30) || (nxtChAsc > 0x39))
            {   
                // First non-# character marks end of number
                if (numFound > -1)
                {
                    // have a valid line#
                    let returnedVal: number = Number(data.substring(stIndex, i));
                    if (isNaN(returnedVal) != true)
                    {               
                        outputArray.set([(returnedVal >> 8)], oaIndex++);    // upper byte
                        outputArray.set([(returnedVal & 0xFF)], oaIndex++);  // lower byte  
                        outputArray.set([0x20], oaIndex++ );                 // place holder for line length
                    }

                    searchMode = Mode.Symbol;   // we have the line# now move on
                    numFound = -1;
                    stIndex = i;                // start of index of next match at current pos.

                    // If next character was space discard it. Not caught by Symbol search.
                    if (nxtChAsc == 0x20) { stIndex += 1; }
                }
            }
        }
        else if (searchMode == Mode.Symbol)
        {
            // Get the character following the line number
            if (nxtChAsc == 0x22) 
            {
                // " quote character
                searchMode = Mode.REMQte;
                outputArray.set([0x22], oaIndex++);      // add quote to output 
            }
            else if (nxtChAsc >= 0x41 && nxtChAsc <= 0x5A)
            {
                // A-Z character
                searchMode = Mode.KeyVar
            }
            else if (nxtChAsc == 0x3A)
            {
                // Colon
                outputArray.set([0x3A], oaIndex++);      // add : to output
                stIndex++;  // skip past colon
            }
            else if (nxtChAsc == 0x0D)
            {
                // EOL
                outputArray.set([0x0D], oaIndex++);      // add EOL to output
                eolProcess(i, data);
                searchMode = Mode.LineNum
            }
            else if (nxtChAsc == 0x20)
            {
                // Space
                stIndex++; // skip past space character
            }
            else 
            {
                // output any chars not already done
                const encoder = new TextEncoder();
                let match: string = data.substring(stIndex,i+1);
                outputArray.set(encoder.encode(match), oaIndex );
                oaIndex += i+1-stIndex;
                stIndex = i+1;
                searchMode = Mode.Symbol;
            }
        }
        else if (searchMode == Mode.KeyVar)
        {
            // Are characters we have are a keyword?
            let match: string = data.substring(stIndex,i+1);
            let tokIndex: number = keywordArray.indexOf(match); // Returns index of keyword or -1 if no match
            
            // Handle keyword match or miss
            if (tokIndex > -1 ) 
            { 
                // Add keyword to output, change mode
                stIndex = i+1;
                let tok: number = tokenArray[tokIndex];         // token hex value
                outputArray.set([(tok >> 8)], oaIndex++ );      // upper byte
                outputArray.set([(tok & 0xFF)],oaIndex++ );     // lower byte 

                tokIndex == 0x54 ? searchMode = Mode.REMQte : searchMode = Mode.Symbol

            }
            else if (nxtChAsc == 0x0D)
            {
                // EOL, output any chars not already done
                const encoder = new TextEncoder();
                outputArray.set(encoder.encode(match), oaIndex);
                oaIndex += i+1-stIndex;
                eolProcess(i, data);
                searchMode = Mode.LineNum;
            }
            else if (nxtChAsc < 0x41 || nxtChAsc > 0x5A)
            {
                // we found a non char but not a keyword, assume variable
                const encoder = new TextEncoder();
                outputArray.set(encoder.encode(match), oaIndex );
                oaIndex += i+1-stIndex;
                stIndex = i+1;

                searchMode = Mode.Symbol;
            }
        }
        else if (searchMode == Mode.REMQte)
        {
            outputArray.set([nxtChAsc & 0xFF], oaIndex++ );    // add char to output
            
            if (nxtChAsc == 0x0D) 
            { 
                // EOL
                eolProcess(i, data);
                searchMode = Mode.LineNum; 
            }
            else if (nxtChAsc == 0x22) 
            {
                // closing " quote character
                stIndex = i+1;
                searchMode = Mode.Symbol;
            }
        }
    }

    let tempBuf: Buffer = Buffer.from(outputArray);
    console.log(hexDump(tempBuf, 0, oaIndex-1));
    console.log("token15-2 - processing complete " + outName);
    
    return header158(outName, "-bas", outputArray.subarray(0, oaIndex), 0);
    
}

//-----------------------------------------------------------------------------
// Close out an EOL by adding line length byte and adjusting pointers
function eolProcess(i: number, data: string)
{
    // line length does not include line # or itself
    let lineLength: number = oaIndex - oaHead - 3;
    outputArray[oaHead + 2] = lineLength;
    oaHead = oaIndex;
    stIndex = i+1;
    numFound = -1;
    
    // if we have a LF after the CR
    if ((i+1 <= data.length) && (data.charCodeAt(i+1) == 0x0A))
    {
        i+=1;
    }
}

//-----------------------------------------------------------------------------
// Process given input file name to produce output file name
// function fNameProcess(fileName: string):string
// {
//     fileName = fileName.toUpperCase();                          // make file name upper case

//     if (fileName.lastIndexOf("PC1500.SBS") > 1)
//     {
//         fileName = fileName.replace("PC1500.SBS", "BAS")
//     }
//     else 
//     {
//         let xPos: number = fileName.lastIndexOf(".");           // will be start of file extension
//         if (xPos == -1) 
//             { xPos = fileName.length; }                         // if no '.'
//         fileName = fileName.slice(0,xPos) + ".BAS";             // add new file extension
//     }

//     return fileName;                                            // fixed up file name  
    
// }

//-----------------------------------------------------------------------------
// Hex editor type screen dump
// Displays from index to index+length, adjusted for 16-byte boundries. 
function hexDump(data: Buffer, index: number, length: number): string
{
    let hexStr: string = "";
    let ascStr: string = "";
    let indStr: string = "";
    let strFmt: string = "";
    let fmtReset: string = "\x1b[0m";
    let fmtBlue: string = "\x1b[34m";
    let fmtDim: string = "\x1b[2m";

    let startIndex: number = Math.floor(index / 16) * 16;
    let endIndex: number = Math.ceil((index+length) / 16) * 16;
    let typeStr: string = "index: " + index + ", length: " + length + "\n";
    //console.log("index: " + index + ", length: " + length);

    //console.log(fmtBlue + "Index  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F   Decoded Text" + fmtReset);
    typeStr += fmtBlue + "Index  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F   Decoded Text\n" + fmtReset;

    for (let i = startIndex; i < endIndex; i += 16)
    {
        hexStr = "";
        ascStr = "";
        indStr = fmtBlue + i.toString(16).padStart(4,'0').toUpperCase() + ":" + fmtReset;

        for (let j = 0; j < 16; j++)
        {
            strFmt = "";
            if ((i+j) < index || (i+j) > (index + length) ) { strFmt=fmtDim; }
            hexStr += strFmt + buf2hex(data.subarray((i+j), (i+j+1))).toUpperCase() + " " + fmtReset;
            ascStr += strFmt;
            ascStr += (data[i+j] > 32 && data[i+j] < 127)? String.fromCharCode(data[i+j]) + " ": ". ";
            ascStr += fmtReset;
        }

        //console.log(indStr + "  " + hexStr + "  " + ascStr);
        typeStr += indStr + "  " + hexStr + "  " + ascStr + "\n";
    }
    //console.log("");
    //console.log(typeStr);
    return typeStr;
}

//-----------------------------------------------------------------------------
// Convert n length Uin8Array to hex string
function buf2hex(buffer: Uint8Array): string
{ 
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join(',');
}