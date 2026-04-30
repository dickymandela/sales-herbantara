/**
 * Google Apps Script for Fetching Sheet Data to Dashboard
 * 
 * Instructions:
 * 1. Open your Google Sheet. 
 *    Ensure your sheet has these headers in the first row (lowercase is fine):
 *    no, order_id, tanggal, nama, no_wa, alamat, produk, qty, satuan, 
 *    harga_satuan, subtotal, bonus, ongkir, potongan_ongkir, total_bayar, 
 *    metode, ekspedisi, catatan
 * 
 * 2. Go to Extensions > Apps Script.
 * 3. Delete everything in the script editor and paste this code.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Select type: 'Web App'.
 * 6. Execute as: 'Me'.
 * 7. Who has access: 'Anyone'.
 * 8. Copy the Web App URL and paste it into your Herbantara Dashboard.
 */

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; 
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0];
  const data = values.slice(1)
    .filter(row => row.join('').trim() !== '') // Filter empty rows
    .map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        if (!header) return;
        let key = header.toString().toLowerCase().trim().replace(/ /g, '_');
        let value = row[index];
        
        // Handle Date conversion to ISO string for JSON
        if (value instanceof Date) {
          value = value.toISOString();
        }
        
        obj[key] = value;
      });
      return obj;
    });

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
