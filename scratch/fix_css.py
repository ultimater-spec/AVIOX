with open('client/src/index.css', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# Clean all lines containing null bytes or spaces between every character (like UTF-16)
valid_lines = [line for line in lines if not '\x00' in line and not line.startswith(' / * ')]

with open('client/src/index.css', 'w', encoding='utf-8') as f:
    f.writelines(valid_lines)
    f.write('''
/* --- Custom Cursor --- */
body {
  cursor: none;
}

a, button, input, select, textarea, [role="button"], .interactive {
  cursor: none !important;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background-color: var(--fg-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(245, 243, 239, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
}

@media (max-width: 768px) {
  body, a, button, input, select, textarea, [role="button"], .interactive {
    cursor: auto !important;
  }
}
''')
