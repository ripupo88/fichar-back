import { toDataURL } from 'qrcode';
import { jsPDF } from 'jspdf';

// With async/await
export const generateQR = async (code: string): Promise<string> => {
  try {
    const QR = await toDataURL(code);
    const doc = new jsPDF();
    const url = 'qrcode/' + code + '.pdf';
    doc.addImage(QR, 'PNG', 0, 15, 60, 60);
    doc.text('Código', 21, 12);
    doc.setFontSize(19);
    doc.text(code, 19, 19);
    doc.setFontSize(25);
    doc.text('Fichar', 18, 78);
    doc.line(61, 0, 61, 90);
    doc.line(0, 90, 61, 90);
    doc.save(url);
    return url;
  } catch (err) {
    return 'err';
  }
};

// Default export is a4 paper, portrait, using millimeters for units
