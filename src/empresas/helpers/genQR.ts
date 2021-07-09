import { toDataURL } from 'qrcode';
import { jsPDF } from 'jspdf';

// With async/await
export const generateQR = async () => {
  try {
    const QR = await toDataURL('485217');
    const doc = new jsPDF();

    doc.addImage(QR, 'PNG', 0, 15, 60, 60);
    doc.text('Código', 21, 12);
    doc.setFontSize(19);
    doc.text('485217', 19, 19);
    doc.setFontSize(25);
    doc.text('Fichar', 18, 78);
    doc.line(61, 0, 61, 90);
    doc.line(0, 90, 61, 90);
    doc.save('a4.pdf');
  } catch (err) {
    console.error(err);
  }
};

// Default export is a4 paper, portrait, using millimeters for units
