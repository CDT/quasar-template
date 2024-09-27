const ExcelJS = require('exceljs');
const path = require('path');

// Load the existing workbook
const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile(path.join(__dirname, 'template.xlsx'))
  .then(() => {
    const sheet = workbook.getWorksheet('Report'); // Assuming the sheet name is 'Report'

    // Populate data
    sheet.addRow([1, 'John Doe', 95]);
    sheet.addRow([2, 'Jane Doe', 85]);

    // Save the modified workbook
    return workbook.xlsx.writeFile(path.join(__dirname, 'populated_report.xlsx'));
  })
  .then(() => {
    console.log('Report generated successfully.');
  })
  .catch(err => {
    console.error('Error generating report:', err);
  });