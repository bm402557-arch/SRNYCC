import html2canvas from 'html2canvas';

/**
 * Robust print helper that prints a specific DOM element cleanly,
 * supporting iframes and modern browsers without printing the rest of the page.
 */
export function printElement(elementId: string, title: string = 'Document'): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for printing.`);
    window.print();
    return false;
  }

  // Get all styles from current document
  let stylesHtml = '';
  const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
  styleElements.forEach((el) => {
    stylesHtml += el.outerHTML;
  });

  // Custom print-specific stylesheet to force exact colors and hide browser headers if possible
  const customPrintStyles = `
    <style>
      @page {
        size: auto;
        margin: 15mm;
      }
      body {
        background-color: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 20px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        min-height: 100vh !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
      }
      .no-print {
        display: none !important;
      }
      .printable-card-wrapper {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 24px !important;
      }
    </style>
  `;

  // Create an isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.title = title;
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Fallback to direct window.print
    window.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 1000);
    return true;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        ${stylesHtml}
        ${customPrintStyles}
      </head>
      <body>
        <div class="printable-card-wrapper">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Wait for images and resources to load before triggering print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.print', e);
      window.print();
    }

    // Clean up iframe after printing dialog closes
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 400);

  return true;
}

/**
 * Downloads a DOM element as a high-resolution PNG image (300 DPI equivalent)
 */
export async function downloadElementAsImage(elementId: string, filename: string = 'student-id-card.png'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for image export.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // 3x scale for crisp, print-ready 300dpi output
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0';
        }
      }
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error generating image from element:', error);
    alert('Unable to generate image. You can use the "Print Card" button to save as PDF.');
    return false;
  }
}
