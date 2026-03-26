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

## Deploy (Vercel)

This repo includes `vercel.json` to route all paths to `index.html` and avoid `404: NOT_FOUND` for static deployments.

```bash
vercel --prod
```


## If GitHub shows merge conflicts

For conflicts in `app.js` and `index.html`, keep the version from this branch that includes:

- `const convertButton = document.getElementById('convertButton');`
- the `window.jspdf` load check and `convertButton.disabled = true` fallback
- only **one** `let selectedFiles = [];` declaration
- the `index.html` script tag without the old `integrity` hash

Then mark resolved and commit the merge.
