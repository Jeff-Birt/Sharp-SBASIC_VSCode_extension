## Syntax highlighter and support programs for Sharp SBASIC

This extension for Visual Studio Code provides the following features:

* Syntax Highlighting for Sharp PC-1500 BASIC
* Create BASIC loader from BIN file
* Tokenizing for Sharp PC-1500 BASIC
* Adding CE-158(X) header to BIN or BAS file# hdr158.ps1
* Concatinating n binary files
* Converts DRLF line ending to CR

To use the helper scripts you will need NODE.JS installed.

V1.1 - Ported PowerShell scripts to TypeScript

2CR.ts -> 2CR.js
Converts a text file to CR line endings

ASCIIHEX2DEC.ts -> ASCIIHEX2DEC.js
Converts an ASCII encoded HEX file to decimal

bin2bldr.ts -> bin2bldr.js
PC-1500 BIN file to BASIC loader script

concat.ts -> concat.js 
Concatenates #n binary files

detoken15.ts -> detoken15.js
Function(s) called by detokenize15.

detokenize15.ts / detokenize15.ss
Command line entery to detokenize Sharp PC-1500 BASIC file and add decode headers

hdr158.ts - hdr158.js
Functions(s) to add CE-158(X) header to file so it be loaded by CE-158(X)

reverse.ts -> reverse.js 
Reverse order of a binary file

token15.ts -> token15.js
PC-1500 SBASIC Tokenizer script
Functions called by tokenize15.js 

Filename: tokenize15-2.ts / tokenize15-2.js
Command line entery to tokenize Sharp PC-1500 BASIC file and add CE-158 header

To make it easier to use the helper scripts (*.js) it is reccomended to set up an environment variable to the install folder. On Windows the installation folder is as shown below. On my system I called this variable 'SBAS'.

C:\Users\<user>\.vscode\extensions\soigeneris.sbasic-1.1.0\tsdist

For example to change line endings of a text file to CR (when you are in the same folder as the source file):

node %SBAS%/2CR.js CRLF.txt ASC


Project repository which includes an instructional PDF and example code is here: https://github.com/Jeff-Birt/Sharp-SBASIC_VSCode_extension

The source code is based on examples from many sources.