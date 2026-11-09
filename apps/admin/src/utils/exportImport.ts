/**
 * Export & Import Utilities for CSV, JSON, and Microsoft Excel formats
 */

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (val: any, row: any) => string;
}

/**
 * Trigger download of text or blob data in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format cell value safely for CSV
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return "";
  let str = "";
  if (Array.isArray(val)) {
    str = val.join("; ");
  } else if (typeof val === "object") {
    str = JSON.stringify(val);
  } else {
    str = String(val);
  }

  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export array of items to CSV with UTF-8 BOM
 */
export function exportToCsv(items: any[], columns: ExportColumn[], filename: string) {
  if (!items || items.length === 0) return;

  const headerRow = columns.map((c) => escapeCsvValue(c.label)).join(",");
  const rows = items.map((item) =>
    columns
      .map((col) => {
        const rawVal = item[col.key];
        const val = col.formatter ? col.formatter(rawVal, item) : rawVal;
        return escapeCsvValue(val);
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headerRow, ...rows].join("\r\n");
  downloadFile(csvContent, filename.endsWith(".csv") ? filename : `${filename}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Export array of items to formatted JSON
 */
export function exportToJson(items: any[], filename: string) {
  const jsonContent = JSON.stringify(items, null, 2);
  downloadFile(jsonContent, filename.endsWith(".json") ? filename : `${filename}.json`, "application/json;charset=utf-8;");
}

/**
 * Export array of items to Microsoft Excel XML Spreadsheet (2003 format)
 * Opens cleanly in Microsoft Excel, LibreOffice, Apple Numbers, Google Sheets
 */
export function exportToExcel(items: any[], columns: ExportColumn[], filename: string, sheetName: string = "Data") {
  if (!items || items.length === 0) return;

  const escapeXml = (str: any): string => {
    if (str === null || str === undefined) return "";
    let s = "";
    if (Array.isArray(str)) {
      s = str.join("; ");
    } else if (typeof str === "object") {
      s = JSON.stringify(str);
    } else {
      s = String(str);
    }
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const headerCells = columns
    .map(
      (c) =>
        `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(c.label)}</Data></Cell>`
    )
    .join("");

  const dataRows = items
    .map((item) => {
      const cells = columns
        .map((col) => {
          const rawVal = item[col.key];
          const val = col.formatter ? col.formatter(rawVal, item) : rawVal;
          const isNum = typeof rawVal === "number" && !isNaN(rawVal);
          const type = isNum ? "Number" : "String";
          return `<Cell><Data ss:Type="${type}">${escapeXml(val)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#007A6C"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#007A6C" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;

  downloadFile(
    xml,
    filename.endsWith(".xls") || filename.endsWith(".xlsx") ? filename : `${filename}.xls`,
    "application/vnd.ms-excel;charset=utf-8;"
  );
}

/**
 * Robust RFC 4180 CSV parser
 */
export function parseCsv(text: string): Record<string, string>[] {
  const clean = text.replace(/^\uFEFF/, ""); // strip BOM
  const lines: string[] = [];
  let currentLine = "";
  let insideQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentLine += '"';
        i++; // skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      if (currentLine.trim()) lines.push(currentLine);
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      const nc = line[i + 1];
      if (c === '"') {
        if (inQuotes && nc === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += c;
      }
    }
    cells.push(cell.trim());
    return cells;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, "").trim());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      let val = values[idx] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      obj[h] = val;
    });
    records.push(obj);
  }

  return records;
}

/**
 * Universal file parser for imported files (.csv, .json, .xls/.xlsx/xml)
 */
export async function parseImportedFile(file: File): Promise<any[]> {
  const content = await file.text();
  const name = file.name.toLowerCase();

  // 1. JSON
  if (name.endsWith(".json") || content.trim().startsWith("[") || content.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
      if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
      if (parsed.doctors && Array.isArray(parsed.doctors)) return parsed.doctors;
      if (parsed.hospitals && Array.isArray(parsed.hospitals)) return parsed.hospitals;
      if (parsed.treatments && Array.isArray(parsed.treatments)) return parsed.treatments;
      if (parsed.destinations && Array.isArray(parsed.destinations)) return parsed.destinations;
      return [parsed];
    } catch (e: any) {
      if (name.endsWith(".json")) throw new Error(`Invalid JSON format: ${e.message}`);
    }
  }

  // 2. Excel XML Spreadsheet
  if (content.includes("xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"") || content.includes("<Workbook")) {
    const rowMatches = content.match(/<Row[^>]*>[\s\S]*?<\/Row>/g);
    if (rowMatches && rowMatches.length > 1) {
      const extractRowCells = (rowXml: string): string[] => {
        const cells: string[] = [];
        const cellMatches = rowXml.match(/<Cell[^>]*>[\s\S]*?<\/Cell>/g) || [];
        for (const c of cellMatches) {
          const dataMatch = c.match(/<Data[^>]*>([\s\S]*?)<\/Data>/);
          cells.push(dataMatch ? dataMatch[1].trim() : "");
        }
        return cells;
      };

      const headers = extractRowCells(rowMatches[0]);
      const results: any[] = [];
      for (let i = 1; i < rowMatches.length; i++) {
        const cells = extractRowCells(rowMatches[i]);
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = cells[idx] || "";
        });
        results.push(obj);
      }
      return results;
    }
  }

  // 3. CSV / TSV fallback
  return parseCsv(content);
}
