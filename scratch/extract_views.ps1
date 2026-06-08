$logPath = "C:\Users\Super Sravan\.gemini\antigravity\brain\ffa63b4a-fb97-4f1a-9f6f-962a8ba05c59\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath

$extractedLines = @{}

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    try {
        $json = ConvertFrom-Json $line -ErrorAction Stop
        if ($json.type -eq "VIEW_FILE" -and $json.content -like "*index.css*") {
            # Extract content lines
            $contentLines = $json.content -split "`n"
            foreach ($cl in $contentLines) {
                if ($cl -match "^(\d+):\s*(.*)$") {
                    $lineNum = [int]$Matches[1]
                    $lineText = $Matches[2]
                    $extractedLines[$lineNum] = $lineText
                }
            }
        }
    } catch {
        # ignore
    }
}

Write-Output "Extracted $($extractedLines.Count) unique lines from views."

# Let's write the sorted lines to a file
$outputPath = "c:\Users\Super Sravan\Downloads\AIforALL\scratch\extracted_css_lines.txt"
$outFileContent = ""
foreach ($key in ($extractedLines.Keys | Sort-Object)) {
    $outFileContent += "$key`: $($extractedLines[$key])`r`n"
}

$outFileContent | Set-Content -Path $outputPath -Encoding utf8
Write-Output "Saved extracted lines to $outputPath"
