from pathlib import Path
from PIL import Image

ROOT = Path("public/assets")
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}


def convert_image(path: Path) -> Path:
    output = path.with_suffix(".webp")

    with Image.open(path) as image:
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        image.save(output, "WEBP", quality=82, method=6)

    return output


def main() -> None:
    converted = 0
    removed = 0

    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        convert_image(path)
        converted += 1
        path.unlink()
        removed += 1

    print(f"Converted {converted} images to WebP and removed {removed} originals.")


if __name__ == "__main__":
    main()
