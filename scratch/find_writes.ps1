$logPath = "C:\Users\Super Sravan\.gemini\antigravity\brain\ffa63b4a-fb97-4f1a-9f6f-962a8ba05c59\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath

$writeCalls = @()

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    try {
        $json = ConvertFrom-Json $line -ErrorAction Stop
        if ($json.tool_calls) {
            foreach ($tc in $json.tool_calls) {
                if ($tc.name -eq "write_to_file" -and $tc.args.TargetFile -like "*index.css*") {
                    $writeCalls += [PSCustomObject]@{
                        Step = $json.step_index
                        Timestamp = $json.created_at
                        Length = $tc.args.CodeContent.Length
                    }
                }
            }
        }
    } catch {
        # ignore
    }
}

Write-Output "Found $($writeCalls.Count) write_to_file calls for index.css:"
$writeCalls | Format-Table -AutoSize
