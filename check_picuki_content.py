import re
from PIL import Image

with open('picuki.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for post cards or text
cards = re.findall(r'<div class="[^"]*video[^"]*"[^>]*>(.*?)</div>', text, re.DOTALL)
print('Video cards:', len(cards))

# Let's search for any captions or titles in the html
captions = re.findall(r'(?:title|alt)="([^"]+)"', text)
for c in captions:
    if len(c) > 10 and not c.startswith('http'):
        print('ALT/TITLE:', c)

