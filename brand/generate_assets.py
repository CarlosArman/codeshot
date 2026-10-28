from pathlib import Path

from PIL import Image, ImageDraw

STANDARD_SIZES = {
    "codeshot-web/icons/icon16.png": 16,
    "codeshot-web/icons/icon32.png": 32,
    "codeshot-web/icons/icon48.png": 48,
    "codeshot-web/icons/icon128.png": 128,
    "codeshot-web/favicon.png": 64,
    "codeshot-vscode/media/favicon.png": 64,
    "brand/png/favicon-16.png": 16,
    "brand/png/favicon-32.png": 32,
    "brand/png/favicon-48.png": 48,
    "brand/png/favicon-64.png": 64,
    "brand/png/chrome-16.png": 16,
    "brand/png/chrome-32.png": 32,
    "brand/png/chrome-48.png": 48,
    "brand/png/chrome-128.png": 128,
}

MARKETPLACE_SIZES = {
    "codeshot-vscode/images/icon.png": 512,
    "brand/png/vscode-128.png": 128,
    "brand/png/vscode-256.png": 256,
    "brand/png/vscode-512.png": 512,
    "brand/png/desktop-256.png": 256,
    "brand/png/desktop-512.png": 512,
    "brand/png/desktop-1024.png": 1024,
}

STOPS = (
    (0.0, (109, 40, 217)),
    (0.30, (124, 58, 237)),
    (0.62, (139, 92, 246)),
    (1.0, (192, 132, 252)),
)


def map_points(points, scale):
    return [(round(x * scale), round(y * scale)) for x, y in points]


def build_gradient(canvas_size):
    base = Image.new("RGBA", (128, 128))
    pixels = base.load()

    for y in range(128):
        for x in range(128):
            position = (x + y) / 254
            for index, (upper, color) in enumerate(STOPS[1:], 1):
                if position <= upper:
                    lower, lower_color = STOPS[index - 1]
                    amount = (position - lower) / (upper - lower)
                    pixels[x, y] = tuple(
                        round(lower_color[channel] * (1 - amount) + color[channel] * amount)
                        for channel in range(3)
                    ) + (255,)
                    break

    return base.resize((canvas_size, canvas_size), Image.Resampling.BICUBIC)


def build_icon(size, marketplace=False):
    scale = max(4, size * 4 // 128)
    canvas_size = 128 * scale
    image = Image.new("RGBA", (canvas_size, canvas_size))
    mask = Image.new("L", (canvas_size, canvas_size))
    mask_draw = ImageDraw.Draw(mask)

    inset, radius = (5, 34) if marketplace else (8, 31)
    mask_draw.rounded_rectangle(
        (inset * scale, inset * scale, (128 - inset) * scale, (128 - inset) * scale),
        radius=radius * scale,
        fill=255,
    )
    image.paste(build_gradient(canvas_size), mask=mask)
    draw = ImageDraw.Draw(image)

    if marketplace:
        frame_paths = (
            [(46, 28), (35, 28), (27, 36), (27, 47)],
            [(82, 28), (93, 28), (101, 36), (101, 47)],
            [(101, 81), (101, 92), (93, 100), (82, 100)],
            [(46, 100), (35, 100), (27, 92), (27, 81)],
        )
        diamond = [(64, 35.8), (92.2, 64), (64, 92.2), (35.8, 64)]
        code_paths = (
            [(60.5, 50.1), (46.8, 64), (60.5, 77.9)],
            [(67.5, 50.1), (81.2, 64), (67.5, 77.9)],
        )
        frame_width, code_width = 5.8, 6.7
    else:
        frame_paths = (
            [(47, 31), (38, 31), (31, 38), (31, 47)],
            [(81, 31), (90, 31), (97, 38), (97, 47)],
            [(97, 81), (97, 90), (90, 97), (81, 97)],
            [(47, 97), (38, 97), (31, 90), (31, 81)],
        )
        diamond = [(64, 39.3), (88.7, 64), (64, 88.7), (39.3, 64)]
        code_paths = (
            [(61, 51.8), (49, 64), (61, 76.2)],
            [(67, 51.8), (79, 64), (67, 76.2)],
        )
        frame_width, code_width = 5.5, 5.7

    for path in frame_paths:
        draw.line(
            map_points(path, scale),
            fill=(245, 243, 255, 194),
            width=round(frame_width * scale),
            joint="curve",
        )

    draw.polygon(map_points(diamond, scale), fill=(255, 255, 255, 255))
    for path in code_paths:
        draw.line(
            map_points(path, scale),
            fill=(109, 40, 217, 255),
            width=max(2, round(code_width * scale)),
            joint="curve",
        )

    return image.resize((size, size), Image.Resampling.LANCZOS)


for output, size in STANDARD_SIZES.items():
    destination = Path(output)
    destination.parent.mkdir(parents=True, exist_ok=True)
    build_icon(size).save(destination)

for output, size in MARKETPLACE_SIZES.items():
    destination = Path(output)
    destination.parent.mkdir(parents=True, exist_ok=True)
    build_icon(size, marketplace=True).save(destination)

print(f"Generated {len(STANDARD_SIZES) + len(MARKETPLACE_SIZES)} refined PNG assets.")
