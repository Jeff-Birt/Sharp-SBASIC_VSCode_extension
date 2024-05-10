# hdr158.ps1
# Adds CE-158(X) header to file so it be loaded by CE-158(X)
# Usage: ./hdr158.ps1 file.ext -type [0x(address)]
#    ML: ./hdr158.ps1 file.bin -bin 0x7C01
#   BAS: ./hdr158.ps1 file.tmp -bas
# Outputs: file.mlb (Machine Language Binary with header)
#        : file.bas (BASIC with header)
# by Hey Birt!

# Create filename.mlb and find length of bin file
$name = $args[0]                                    # filename
[UInt16]$fLen = (Get-Item $name).Length - 1         # bin file length

$type = $args[1]                                    # 
if ($type -eq '-bin')
{
    [string]$outName = $name -Replace "tmp","mlb"   # change extension
    $outName = $outName.ToUpper()                   # make file name upper case
    $address = $args[1]                             # starting address of program
    $marker = 0x42                                  # the B in BCOM
}
elseif ($type -eq '-bas')
{
    [string]$outName = $name -Replace "tmp","bas"   # change extension          
    $outName = $outName.ToUpper()                   # make file name upper case 
    $address = 0x2000                               # bogus starting address         
    $marker = 0x40                                  # the @ in BCOM
}
# *** should trap incorrect or missing args[1]

# CE-158 type, @COM=BASIC, ACOM=RESERVE, BCOM=ML
# Add 0x01 marker and 'BCOM' type, pad name with 0x00
$enc = [System.Text.Encoding]::UTF8
[byte[]] $header = 0x01,$marker,0x43,0x4f,0x4D  # 0x01,BCOM or @COM
$header +=  $enc.GetBytes($outName)             # filename

$plen = 16 - $outName.Length
for ($i = 0; $i -lt $plen; $i++) { $header += 0x00 }

# Convert address to seperate H/L bytes and add to header
$header += ($address -shr 8)                    # upper byte
$header += ($address -band 0xFF)                # lower byte

# Convert file length to seperate H/L bytes and add to header
$header += ($fLen -shr 8)                       # upper byte
$header += ($fLen -band 0xFF)                   # lower byte

# Add two trailing numbers, value undefined
$header += 0x00
$header += 0x00

# Dump header for troubleshooting, in HEX
#Write-Host $([System.BitConverter]::ToString($header)) 

# A rather clunky way to concatentate binary files
# Save header, concat header + bin to tempFile
# Copy tempFile to .mlb and delete tempFile
$tempFile = "temp.file"
Set-Content -Value $header -encoding byte -path $outName
Get-Content -Path $outName, $name -Raw  | Set-Content -NoNewline $tempFile
Get-Content -Path $tempFile -Raw  | Set-Content -NoNewline $outName
Remove-Item -Path $tempFile