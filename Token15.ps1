# PC-1500 SBASIC Tokenizer script
# Use - Token15 fileName.sbs
# Outputs -     fileName.bas
# Keywords much be space delimeted in source file
# EOL in source CRLF or LF. Tokenized file will have CR line endings.
# By - Hey Birt!

# PC-1500 BASIC keywords
$keywordArray = @("ABS","ACS","AND","AREAD","ARUN","ASC","ASN","ATN") #8
$keywordArray += ("BEEP","BREAK") #2
$keywordArray += ("CALL","CHAIN","CHR$","CLEAR","CLOAD","CLS","COM$","CONSOLE","CONT","COLOR","COS","CSAVE","CSIZE","CURSOR") #14
$keywordArray += ("DATA","DEG","DEGREE","DEV$","DIM","DMS","DTE") #7
$keywordArray += ("END","ERL","ERN","ERROR","EXP") #5
$keywordArray += ("FEED","FOR") #2
$keywordArray += ("GCURSOR","GLCURSOR","GOSUB","GOTO","GPRINT","GRAD","GRAPH") #7
$keywordArray += ("IF","INKEY$","INPUT","INSTAT","INT") #5
$keywordArray += ("LCURSOR","LEFT$","LEN","LET","LF","LINE","LIST","LLIST","LN","LOCK","LOG","LPRINT") #12
$keywordArray += ("MEM","MERGE","MID$") #3
$keywordArray += ("NEW","NEXT","NOT") #3
$keywordArray += ("OFF","ON","OPN","OR","OUTSTAT") #5
$keywordArray += ("PAUSE","PEEK","PEEK#","PI","POINT","POKE","POKE#","PRINT") #8
$keywordArray += ("RADIAN","RANDOM","READ","REM","RESTORE","RETURN","RIGHT$","RINKEY$","RLINE","RMT","RND","ROTATE","RUN") #13
$keywordArray += ("SETCOM","SETDEV","SGN","SIN","SORGN","SPACE$","SQR","STATUS","STEP","STOP","STR$") #11
$keywordArray += ("TAB","TAN","TERMINAL","TEST","TEXT","THEN","TIME","TO","TRANSMIT","TROFF","TRON") #11
$keywordArray += ("UNLOCK","USING") #2
$keywordArray += ("VAL") #1
$keywordArray += ("WAIT") #1
$keywordArray += ("ZONE") #1

# PC-1500 BASIC keyword tokens. In same order as keywords.
$tokenArray = @(0xF170,0xF174,0xF150,0xF180,0xF181,0xF160,0xF173,0xF175) #8
$tokenArray += (0xF182,0xF0B3) #2
$tokenArray += (0xF18A,0xF0B2,0xF163,0xF187,0xF089,0xF088,0xE858,0xF0B1,0xF183,0xF0B5,0xF17E,0xF095,0xE680,0xF084) #14
$tokenArray += (0xF18D,0xF165,0xF18C,0xE857,0xF18B,0xF166,0xE884) #7
$tokenArray += (0xF18E,0xF053,0xF052,0xF1B4,0xF178) #5
$tokenArray += (0xF0B0,0xF1A5) #2
$tokenArray += (0xF093,0xE682,0xF194,0xF192,0xF09F,0xF186,0xE681) #7
$tokenArray += (0xF196,0xF15C,0xF091,0xE859,0xF171) #5
$tokenArray += (0xE683,0xF17A,0xF164,0xF198,0xF0B6,0xF0B7,0xF090,0xF0B8,0xF176,0xF1B5,0xF177,0xF0B9) #12
$tokenArray += (0xF158,0xF08F,0xF17B) #3
$tokenArray += (0xF19B,0xF19A,0xF16D) #3
$tokenArray += (0xF19E,0xF19C,0xF19D,0xF151,0xE880)#5
$tokenArray += (0xF1A2,0xF16F,0xF16E,0xF15D,0xF168,0xF1A1,0xF1A0,0xF097) #8
$tokenArray += (0xF1AA,0xF1A8,0xF1A6,0xF1AB,0xF1A7,0xF199,0xF172,0xE85A,0xF0BA,0xE7A9,0xF17C,0xE685,0xF1A4) #13
$tokenArray += (0xE882,0xE886,0xF179,0xF17D,0xE684,0xF061,0xF16B,0xF167,0xF1AD,0xF1AC,0xF161)#11
$tokenArray += (0xF0BB,0xF17F,0xE883,0xF0BC,0xE686,0xF1AE,0xF15B,0xF1B1,0xE885,0xF1B0,0xF1AF) #11
$tokenArray += (0xF1B6,0xF085) #2
$tokenArray += (0xF162) #1
$tokenArray += (0xF1B3) #1
$tokenArray += (0xF0B4) #1

$sourceFile = Get-Content -Path $args[0]
#$sourceFile = Get-Content -Path .\para.pc1500.sbs # *** for testing
$linesArray = $sourceFile -Split "`r?`n"        # split source file into array of lines
[byte[]] $outputArray = @()

$outName = $args[0] -Replace "pc1500.sbs","bas" # change extension
#$outName = 'para.pc1500.sbs' -Replace "pc1500.sbs","bas" # change extension ***fortesting                 

for ($l = 0; $l -lt $linesArray.Length; $l++)
{
    [byte[]] $outputLine = @()                  # build each line 

    # Split lines on colon into statements
    $string = $linesArray[$l]
    $statement = $string -Split ':+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)'

    for ($i = 0; $i -lt $statement.Length; $i++)
    {
        # Split statements on space into segments
        $segment = $statement[$i] -Split  ' +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)'

        for ($j = 0; $j -lt $segment.Length; $j++)
        {
            if (($i -eq 0) -and ($j -eq 0)) 
            {
                # Trap missing line number
                [int]$returnedVal = 0
                [bool]$result = [int]::TryParse($segment[0],[ref]$returnedVal)
                if ($result -eq 1)
                {
                    [uint16]$lineNum = $returnedVal
                    $outputLine += ($lineNum -shr 8)                   # upper byte
                    $outputLine += ($lineNum -band 0xFF)               # lower byte
                    $outputLine += [System.Text.Encoding]::UTF8.GetBytes(" ") # place holder
                }
                else 
                {
                    $j = $segment.Length
                }
            }
            else 
            {
                # If segment is keyword find token 
                $index = [array]::IndexOf($keywordArray, $segment[$j])
                if ($index -ge 0)
                {
                    $tok = $tokenArray[$index] #token hex value
                    $outputLine += ($tok -shr 8)                   # upper byte
                    $outputLine += ($tok -band 0xFF)               # lower byte
 
                    # If this is a REM statement find where it is in the line
                    # copy all after REM verbatium until EOL
                    if ($segment[$j] -eq 'REM')
                    {
                        $index = $string.IndexOf('REM')
                        $j = $segment.Length;
                        $i = $statement.Length

                        $outputLine += [System.Text.Encoding]::UTF8.GetBytes($string.Substring(($index+3)))
                    }
                }
                else 
                {
                    # Not a keyword so copy verbatium
                    $outputLine += [System.Text.Encoding]::UTF8.GetBytes($segment[$j])
                }
            }

        } # segment loop

        $outputLine += [System.Text.Encoding]::UTF8.GetBytes(":")

    } # statement loop

    # No output on empty lines. 
    # On valid lines EOL will replace last : added above
    if ($outputLine.Length -gt 1)
    {
        $outputLine[$outputLine.Length - 1] = [byte](0x0D)  # end of line

        [int16]$lineLength = $outputLine.Length - 3         # calcualte line length
        $outputLine[2] = ($lineLength -band 0xFF)           # set line length byte

        $outputArray += $outputLine                         # copy line to array
    }

} # lines loop


Write-Output $outputArray | Format-Hex

Set-Content -Value $outputArray -encoding byte -path $outName