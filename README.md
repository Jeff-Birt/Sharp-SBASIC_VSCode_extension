## Syntax highlighter and support programs for Shapr SBASIC

This extension for Visual Studio Code provides the following features:

* Syntax Highlighting for Sharp PC-1500 BASIC
* Create BASIC loader from BIN file
* Tokenizing for Sharp PC-1500 BASIC
* Adding CE-158(X) header to BIN or BAS file# hdr158.ps1

# bin2BLdr.ps1 - PC-1500 BIN file to BASIC loader script
# Converts a binary file into a BASIC loader program in ASCII format
# Usage: './bin2BLdr fileName.bin startingAddress' NOTE: Use 0x#### for hex values

# hdr158.ps1 - Adds CE-158(X) header to file so it be loaded by CE-158(X)
# Usage: ./hdr158.ps1 file.tmp -type [0x(address)]
#    ML: ./hdr158.ps1 file.tmp -bin 0x7C01
#   BAS: ./hdr158.ps1 file.tmp -bas
# Outputs: file.mlb (Machine Language Binary with header)
#        : file.bas (BASIC with header)

# Token15.ps1 - PC-1500 SBASIC Tokenizer script
# Use - Token15 fileName.sbs
# Outputs -     fileName.bas
# Keywords much be space delimeted in source file
# EOL in source CRLF or LF. Tokenized file will have CR line endings.


Project repository which includes an instructional PDF and example code is here: https://github.com/Jeff-Birt/Sharp-SBASIC_VSCode_extension

The source code is based on examples from many sources.