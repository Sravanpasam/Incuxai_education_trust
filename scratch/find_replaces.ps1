$logPath = "C:\Users\Super Sravan\.gemini\antigravity\brain\ffa63b4a-fb97-4f1a-9f6f-962a8ba05c59\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath

$replaceCalls = @()

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    try {
        $json = ConvertFrom-Json $line -ErrorAction Stop
        if ($json.tool_calls) {
            foreach ($tc in $json.tool_calls) {
                if (($tc.name -eq "replace_file_content" -or $tc.name -eq "multi_replace_file_content") -and $tc.args.TargetFile -like "*index.css*") {
                    $replaceCalls += [PSCustomObject]@{
                        Step = $json.step_index
                        Timestamp = $json.created_at
                        Tool = $tc.name
                        StartLine = $tc.args.StartLine
                        EndLine = $tc.args.EndLine
                        Target = $tc.args.TargetContent
                        Replacement = $tc.args.ReplacementContent
                        ChunksCount = if ($tc.args.ReplacementChunks) { $tc.args.ReplacementChunks.Count } else { $null }
                        Chunks = $tc.args.ReplacementChunks
                    }
                }
            }
        }
    } catch {
        # ignore
    }
}

Write-Output "Found $($replaceCalls.Count) replace tool calls targeting index.css."
foreach ($call in $replaceCalls) {
    Write-Output "================================================="
    Write-Output "STEP: $($call.Step) | TIMESTAMP: $($call.Timestamp) | TOOL: $($call.Tool)"
    if ($call.Tool -eq "replace_file_content") {
        Write-Output "Lines: $($call.StartLine) - $($call.EndLine)"
        Write-Output "--- TARGET CONTENT ---"
        Write-Output $call.Target
        Write-Output "--- REPLACEMENT CONTENT ---"
        Write-Output $call.Replacement
    } else {
        Write-Output "Chunks: $($call.ChunksCount)"
        foreach ($chunk in $call.Chunks) {
            Write-Output "  Chunk Lines: $($chunk.StartLine) - $($chunk.EndLine)"
            Write-Output "  --- TARGET ---"
            Write-Output $chunk.TargetContent
            Write-Output "  --- REPLACEMENT ---"
            Write-Output $chunk.ReplacementContent
        }
    }
}
