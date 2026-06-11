from pathlib import Path

p = Path('src/App.tsx')
text = p.read_text(encoding='utf-8')
lines = text.splitlines()
out = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.strip() == '<<<<<<< HEAD':
        i += 1
        head = []
        while i < len(lines) and lines[i].strip() != '=======':
            head.append(lines[i])
            i += 1
        if i >= len(lines):
            raise SystemExit('Malformed conflict: missing =======')
        i += 1
        incoming = []
        while i < len(lines) and not lines[i].strip().startswith('>>>>>>>'):
            incoming.append(lines[i])
            i += 1
        if i >= len(lines):
            raise SystemExit('Malformed conflict: missing >>>>>>>')
        i += 1
        if any('Volunteer Hero' in x for x in head) and any('Volunteer Network' in x for x in incoming):
            chosen = head + incoming
        elif any('Volunteer Application' in x for x in head) and any('Become a Volunteer' in x for x in incoming):
            chosen = head
        elif any('TeachXai' in x and 'section-header' in x for x in head):
            chosen = head
        elif any('https://www.instagram.com/incuxai' in x for x in head):
            chosen = head
        elif any('https://youtube.com/@incuxai' in x for x in head):
            chosen = head
        elif any('src={ourVisionImg}' in x for x in head):
            chosen = head
        elif any('card tilt-card' in x for x in head):
            chosen = head
        else:
            chosen = head
        out.extend(chosen)
    else:
        out.append(line)
        i += 1
p.write_text('\n'.join(out) + '\n', encoding='utf-8')
print('Patched src/App.tsx')
