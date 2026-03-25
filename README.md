# JPG to PDF Converter

A lightweight website that converts JPG/JPEG images into a single PDF directly in the browser.

## Privacy behavior

- Images are never uploaded to any backend.
- Conversion runs fully on the client using `jsPDF`.
- Selected file references are cleared after conversion, when the user clicks **Clear Data Now**, and on page unload.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
