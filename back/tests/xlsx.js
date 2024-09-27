// exceljs demo1:

const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Report');

sheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 30 },
  { header: 'Score', key: 'score', width: 10 }
];

sheet.addRow({ id: 1, name: 'John Doe', score: 95 });
sheet.addRow({ id: 2, name: 'Jane Doe', score: 85 });

workbook.xlsx.writeFile(path.join(__dirname, 'exceljs1.xlsx'));

// node-xlsx demo1:
const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const data = [
  ['ID', 'Name', 'Score'],
  [1, 'John Doe', 95],
  [2, 'Jane Doe', 85]
];

const buffer = xlsx.build([{ name: 'Report', data }]);
fs.writeFileSync(path.join(__dirname, 'node-xlsx1.xlsx'), buffer);

// xslx demo1:
const XLSX = require('xlsx');
const path = require('path');

const ws_data = [
  ['ID', 'Name', 'Score'],
  [1, 'John Doe', 95],
  [2, 'Jane Doe', 85]
];

const ws = XLSX.utils.aoa_to_sheet(ws_data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Report');

XLSX.writeFile(wb, path.join(__dirname, 'xlsx1.xlsx'));
