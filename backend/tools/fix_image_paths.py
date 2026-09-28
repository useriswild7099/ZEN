import re

file_path = 'prompts.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace %20 with space in image paths
# Look for lines like "image": "/personalities/..."
new_content = re.sub(r'("image":\s*"/personalities/[^"]+?)%20([^"]+")', lambda m: m.group(1) + " " + m.group(2), content)

# Do it again in case there are multiple %20s
while "%20" in new_content:
     new_content = new_content.replace("%20", " ")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced %20 with spaces in prompts.py")
