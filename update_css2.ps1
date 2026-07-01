$content = Get-Content -Path ".\src\index.css" -Raw

$content = $content -replace 'nav a:hover, nav a\.active \{\s*color: var\(--primary\) !important;\s*background: rgba\(255, 255, 255, 0\.8\);\s*border: 1px solid rgba\(249, 115, 22, 0\.25\);\s*box-shadow: 0 4px 12px rgba\(249, 115, 22, 0\.08\);', "nav a:hover, nav a.active {`r`n  color: #ffffff !important;`r`n  background: var(--x-gradient);`r`n  border: 1px solid transparent;`r`n  box-shadow: 0 4px 14px rgba(237, 30, 121, 0.25);"

$content = $content -replace '\.portal-nav-btn\.active,\s*\.portal-nav-btn:hover \{\s*border-color: rgba\(249, 115, 22, 0\.15\);\s*color: var\(--primary\);\s*background: rgba\(249, 115, 22, 0\.06\);', ".portal-nav-btn.active,`r`n.portal-nav-btn:hover {`r`n  background: var(--x-gradient);`r`n  color: #ffffff !important;`r`n  border-color: transparent;"

$content | Set-Content -Path ".\src\index.css"
