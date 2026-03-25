const form = document.getElementById('convertForm');
const imageInput = document.getElementById('imageInput');
const statusEl = document.getElementById('status');
const pdfNameInput = document.getElementById('pdfName');
const clearDataButton = document.getElementById('clearDataButton');
const convertButton = document.getElementById('convertButton');

let selectedFiles = [];


if (!window.jspdf || !window.jspdf.jsPDF) {
  setStatus('PDF library failed to load. Check internet/CDN access and refresh.', true);
  convertButton.disabled = true;
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#fca5a5' : '#93c5fd';
}

function clearClientData() {
  selectedFiles = [];
  imageInput.value = '';
  if (performance && typeof performance.clearResourceTimings === 'function') {
    performance.clearResourceTimings();
  }
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function convertToPdf(files, fileName) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    throw new Error('PDF library failed to load. Please refresh and try again.');
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'pt', compress: true });

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const imageData = await fileToDataUrl(file);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error(`Could not load ${file.name}`));
      img.src = imageData;
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const scale = Math.min(pageWidth / img.width, pageHeight / img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    if (i > 0) pdf.addPage();
    pdf.addImage(imageData, 'JPEG', x, y, width, height, undefined, 'FAST');

    // Remove decoded image source from memory as soon as page is added.
    img.src = '';
  }

  pdf.save(`${fileName || 'converted-images'}.pdf`);
}

imageInput.addEventListener('change', () => {
  selectedFiles = Array.from(imageInput.files || []);
  if (selectedFiles.length > 0) {
    setStatus(`${selectedFiles.length} image(s) selected.`);
  } else {
    setStatus('No files selected yet.');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!selectedFiles.length) {
    setStatus('Please select at least one JPG image.', true);
    return;
  }

  try {
    setStatus('Converting...');
    const safeFiles = selectedFiles.filter((file) => ['image/jpeg', 'image/jpg'].includes(file.type));

    if (!safeFiles.length) {
      setStatus('Only JPG/JPEG files are allowed.', true);
      return;
    }

    await convertToPdf(safeFiles, pdfNameInput.value.trim());
    setStatus('Done! PDF downloaded. Local image data has been cleared.');
  } catch (error) {
    setStatus(error.message || 'Conversion failed.', true);
  } finally {
    clearClientData();
  }
});

clearDataButton.addEventListener('click', () => {
  clearClientData();
  setStatus('All selected local data has been cleared.');
});

window.addEventListener('beforeunload', clearClientData);
