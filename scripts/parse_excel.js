const XLSX = require('xlsx');
const fs = require('fs');

try {
  const workbook = XLSX.readFile('project-specs/project-specification (final).xlsx');
  const sheet_name_list = workbook.SheetNames;
  let output = '';
  sheet_name_list.forEach(y => {
      const worksheet = workbook.Sheets[y];
      const data = XLSX.utils.sheet_to_json(worksheet);
      output += `\n\n--- Sheet: ${y} ---\n`;
      output += JSON.stringify(data, null, 2);
  });
  fs.writeFileSync('project-specs/parsed_spec.txt', output);
  console.log('Successfully parsed Excel file to project-specs/parsed_spec.txt');
} catch (e) {
  console.error('Error parsing Excel file:', e);
}
