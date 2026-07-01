$content = Get-Content -Path ".\src\index.css" -Raw

# 1. Variables
$content = $content -replace '--primary: #8cc63f;', '--primary: #ed1e79;'
$content = $content -replace '--success: #8cc63f;', '--success: #ed1e79;'
if ($content -notmatch '--x-gradient') {
    $content = $content -replace '--warning: #fbb03b;', "--warning: #fbb03b;`r`n  --x-gradient: linear-gradient(135deg, #fbb03b 0%, #ed1e79 100%);"
}

# 2. Header and Layout
$content = $content -replace 'padding-top: 40px; /\* Universal offset for the fixed header \*/', "padding-top: 55px; /* Universal offset */`r`n}`r`n#home {`r`n  padding-top: 0;"
$content = $content -replace 'height: 48px; /\* Universal top header height \*/', 'height: 55px; /* Sleek header */'
$content = $content -replace 'background: rgba\(255, 255, 255, 0.95\);', 'background: rgba(255, 255, 255, 0.2);'
$content = $content -replace 'height: 38px;', 'height: 40px;'
$content = $content -replace 'height: calc\(100vh - 40px\); /\* Starts below the 40px header \*/', 'height: 100vh; /* Full screen, header overlays */'
$content = $content -replace 'height: calc\(100vh - 48px\);', 'height: 100vh;'

# 3. Logo and Nav text to --text
$content = $content -replace 'color: var\(--text\);', 'color: var(--text);' # Ensures it's there
$content = $content -replace 'background: rgba\(255, 255, 255, 0.35\); /\* Translucent pill background for outstanding visibility \*/', 'background: transparent;'

# 4. Buttons and Gradients
$content = $content -replace '\.btn-login \{\s*background: var\(--primary\);', ".btn-login {`r`n  background: var(--x-gradient);"
$content = $content -replace '\.btn-primary \{\s*background: var\(--primary\);', ".btn-primary {`r`n  background: var(--x-gradient);"

# 5. Section titles
$content = $content -replace '\.section-title \{\s*font-family: ''Space Grotesk'', sans-serif;\s*font-size: clamp\(1\.8rem, 3\.5vw, 2\.8rem\);\s*font-weight: 700;\s*letter-spacing: -0\.03em;\s*color: var\(--text\);', ".section-title {`r`n  font-family: 'Space Grotesk', sans-serif;`r`n  font-size: clamp(1.8rem, 3.5vw, 2.8rem);`r`n  font-weight: 700;`r`n  letter-spacing: -0.03em;`r`n  background: var(--x-gradient);`r`n  -webkit-background-clip: text;`r`n  -webkit-text-fill-color: transparent;"

# 6. Active states to --x-gradient
$content = $content -replace 'background: var\(--primary\);\s*border-color: var\(--primary\);\s*box-shadow: 0 4px 14px rgba\(249, 115, 22, 0\.4\);', "background: var(--x-gradient);`r`n  border-color: transparent;`r`n  box-shadow: 0 4px 14px rgba(237, 30, 121, 0.25);"
$content = $content -replace '\.about-btn\.active,\s*\.about-btn:hover \{\s*background: var\(--primary\);\s*color: #ffffff;\s*border-color: var\(--primary\);', ".about-btn.active,`r`n.about-btn:hover {`r`n  background: var(--x-gradient);`r`n  color: #ffffff;`r`n  border-color: transparent;"
$content = $content -replace '\.modal-tab\.active \{\s*background: var\(--primary\);', ".modal-tab.active {`r`n  background: var(--x-gradient);"
$content = $content -replace 'background: rgba\(168, 85, 247, 0\.06\);', 'background: var(--x-gradient); color: #ffffff !important;'
$content = $content -replace 'background: linear-gradient\(135deg, var\(--primary\), #0d5c9e\);', 'background: var(--x-gradient);'
$content = $content -replace '\.about-pill-btn\.active \{\s*background: var\(--primary\);', ".about-pill-btn.active {`r`n  background: var(--x-gradient);"

# 7. Additional nav a active
$content = $content -replace 'header:not\(\.scrolled\) nav a:hover, header:not\(\.scrolled\) nav a\.active \{\s*color: #ffffff !important;\s*background: var\(--primary\);\s*border-color: var\(--primary\);\s*box-shadow: 0 4px 14px rgba\(249, 115, 22, 0\.4\);', "header:not(.scrolled) nav a:hover, header:not(.scrolled) nav a.active {`r`n  color: #ffffff !important;`r`n  background: var(--x-gradient);`r`n  border-color: transparent;`r`n  box-shadow: 0 4px 14px rgba(237, 30, 121, 0.25);"

$content | Set-Content -Path ".\src\index.css"
