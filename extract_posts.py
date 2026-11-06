import re

with open('picuki.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find all <a ... class="...video..."> or similar
posts = re.findall(r'<a[^>]+href="([^"]+)"[^>]*>.*?<img[^>]+src="([^"]+)".*?</a>', text, re.DOTALL)
print('Found posts:', len(posts))
for h, src in posts[:10]:
    print('HREF:', h)
    print('SRC:', src[:90])

