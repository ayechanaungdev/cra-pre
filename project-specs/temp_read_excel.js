const XLSX = require('xlsx');
const workbook = XLSX.readFile('project-specification (final).xlsx');
console.log('SHEETS:', JSON.stringify(workbook.SheetNames));
workbook.SheetNames.forEach(name => {
    console.log(`--- SHEET: ${name} ---`);
    console.log(XLSX.utils.sheet_to_csv(workbook.Sheets[name]));
});
