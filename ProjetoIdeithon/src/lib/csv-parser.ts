import Papa from "papaparse";

export interface ParsedData {
  headers: string[];
  rows: Record<string, string>[];
  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
  totalRows: number;
}

export function parseCSV(text: string): ParsedData {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const headers = result.meta.fields || [];
  const rows = result.data as Record<string, string>[];

  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];

  headers.forEach((header) => {
    const sampleValues = rows
      .slice(0, Math.min(20, rows.length))
      .map((row) => row[header])
      .filter((v) => v !== undefined && v !== null && v !== "");

    if (sampleValues.length === 0) return;

    const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}|^\d{2}[-/]\d{2}[-/]\d{4}/;
    const isDate = sampleValues.every((v) => datePattern.test(v));
    if (isDate) {
      dateColumns.push(header);
      return;
    }

    const numericValues = sampleValues.map((v) =>
      parseFloat(v.replace(/[,$%\s]/g, ""))
    );
    const isNumeric =
      numericValues.filter((n) => !isNaN(n)).length / sampleValues.length > 0.8;

    if (isNumeric) {
      numericColumns.push(header);
    } else {
      categoricalColumns.push(header);
    }
  });

  return {
    headers,
    rows,
    numericColumns,
    categoricalColumns,
    dateColumns,
    totalRows: rows.length,
  };
}

export function getColumnStats(rows: Record<string, string>[], column: string) {
  const values = rows
    .map((r) => parseFloat((r[column] || "").replace(/[,$%\s]/g, "")))
    .filter((n) => !isNaN(n));

  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  return {
    count: values.length,
    sum: Math.round(sum * 100) / 100,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    range: Math.round((max - min) * 100) / 100,
  };
}

export function getCategoryCounts(
  rows: Record<string, string>[],
  column: string
) {
  const counts: Record<string, number> = {};
  rows.forEach((row) => {
    const val = row[column] || "N/A";
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));
}

export function getCorrelation(
  rows: Record<string, string>[],
  col1: string,
  col2: string
): number {
  const pairs = rows
    .map((r) => ({
      x: parseFloat((r[col1] || "").replace(/[,$%\s]/g, "")),
      y: parseFloat((r[col2] || "").replace(/[,$%\s]/g, "")),
    }))
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));

  if (pairs.length < 3) return 0;

  const n = pairs.length;
  const sumX = pairs.reduce((a, p) => a + p.x, 0);
  const sumY = pairs.reduce((a, p) => a + p.y, 0);
  const sumXY = pairs.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = pairs.reduce((a, p) => a + p.x * p.x, 0);
  const sumY2 = pairs.reduce((a, p) => a + p.y * p.y, 0);

  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  return den === 0 ? 0 : Math.round((num / den) * 1000) / 1000;
}
