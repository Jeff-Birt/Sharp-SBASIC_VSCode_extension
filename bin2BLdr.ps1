# PC-1500 BIN file to BASIC loader script
# Converts a binary file into a BASIC loader program in ASCII format
# Usage: './bin2BLdr fileName.bin startingAddress' NOTE: Use 0x#### for hex values
# by - Hey Birt!

[string]$fileName =  $args[0]
[int]$startAddress = $args[1]
Write-Output "Converting $fileName to BASIC loader at address &$startAddress"

$bytes = Get-Content .\$filename -Encoding byte -Raw
$len = $bytes.Length
Write-Output "Length $filename"

$lineInc = 10
$lineNum = 10

# Loop through byte aryay in blocks of 8
for ($i = 0; $i -lt $len; $i+=8) 
{
    $cnt = 0            # counts num of poke values in line
    $line += $lineNum.ToString() + " POKE &" + $startAddress.ToString("X2")
    $lineNum += $lineInc

    # 8 poke values per line
    while ( $cnt -lt 8)
    {
        $index = $i + $cnt
        $line += ",&" + [System.BitConverter]::ToString($bytes[$index])
        $cnt += 1

        # end loop early, we hit end of array
        if ($($index + 1) -eq $len) {$cnt = 8}
    }

    $startAddress += 8  # Inc the start address for next line
    $line += "`r"       # Add a /CR to end of each line
}

$line += "`r"           # Add an /CR to end of file

# Seperate filename from extesnion, save filename.asc
$name = $fileName.Trim(".bin")
Set-Content -path ".\$name.asc" -Value $line
Write-Host "Conversion complete. $name"



