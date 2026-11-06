import sys
import os
from PIL import Image, ImageDraw, ImageFilter

def apply_flou(image_path):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist")
        return False
    try:
        im = Image.open(image_path).convert("RGBA")
        w, h = im.size

        # Create soft feather mask for the edges
        mask = Image.new("L", (w, h), 0)
        draw = ImageDraw.Draw(mask)
        
        # Center oval area where content is clear
        draw.ellipse([int(w * 0.06), int(h * 0.06), int(w * 0.94), int(h * 0.94)], fill=255)
        
        # Generous Gaussian blur for soft flou transition
        blur_radius = max(20, int(min(w, h) * 0.05))
        mask = mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))

        im.putalpha(mask)
        im.save(image_path, "PNG", optimize=True)
        print(f"Successfully applied flou edges to {image_path}")
        return True
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        apply_flou(sys.argv[1])
    else:
        print("Usage: python feather_image.py <path_to_image>")

