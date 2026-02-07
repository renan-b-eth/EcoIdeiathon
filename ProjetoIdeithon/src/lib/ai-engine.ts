import {
  type ParsedData,
  getColumnStats,
  getCategoryCounts,
  getCorrelation,
} from "./csv-parser";

export interface Insight {
  type: "trend" | "anomaly" | "correlation" | "distribution" | "summary";
  title: string;
  description: string;
  severity: "info" | "warning" | "success";
  metric?: string;
  value?: string;
}

export interface AnalysisResult {
  summary: string;
  insights: Insight[];
  suggestedCharts: ChartSuggestion[];
  narrative: string;
  dataQuality: { score: number; issues: string[] };
}

export interface ChartSuggestion {
  type: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  xKey: string;
  yKey?: string;
  data: Record<string, unknown>[];
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function analyzeData(data: ParsedData): AnalysisResult {
  const insights: Insight[] = [];
  const suggestedCharts: ChartSuggestion[] = [];
  const qualityIssues: string[] = [];

  // Data quality checks
  let missingCount = 0;
  data.rows.forEach((row) => {
    data.headers.forEach((h) => {
      if (!row[h] || row[h].trim() === "") missingCount++;
    });
  });
  const totalCells = data.rows.length * data.headers.length;
  const missingPct = totalCells > 0 ? (missingCount / totalCells) * 100 : 0;
  if (missingPct > 5) qualityIssues.push(`${missingPct.toFixed(1)}% of cells are empty`);
  if (data.totalRows < 10) qualityIssues.push("Small dataset — insights may be limited");

  const qualityScore = Math.max(0, Math.min(100, 100 - missingPct * 2 - qualityIssues.length * 10));

  // Summary insight
  insights.push({
    type: "summary",
    title: "Dataset Overview",
    description: `Your dataset contains **${data.totalRows} rows** and **${data.headers.length} columns** (${data.numericColumns.length} numeric, ${data.categoricalColumns.length} categorical${data.dateColumns.length > 0 ? `, ${data.dateColumns.length} date` : ""}).`,
    severity: "info",
    metric: "Rows",
    value: data.totalRows.toString(),
  });

  // Analyze numeric columns
  data.numericColumns.forEach((col) => {
    const stats = getColumnStats(data.rows, col);
    if (!stats) return;

    // Distribution insight
    const cv = stats.mean !== 0 ? (stats.stdDev / Math.abs(stats.mean)) * 100 : 0;
    if (cv > 50) {
      insights.push({
        type: "distribution",
        title: `High variability in "${col}"`,
        description: `The column "${col}" shows high variability (CV: ${cv.toFixed(1)}%). Values range from **${fmt(stats.min)}** to **${fmt(stats.max)}** with a mean of **${fmt(stats.mean)}**. This suggests diverse data points or potential outliers.`,
        severity: "warning",
        metric: col,
        value: `CV: ${cv.toFixed(1)}%`,
      });
    }

    // Outlier detection (simple IQR method)
    const values = data.rows
      .map((r) => parseFloat((r[col] || "").replace(/[,$%\s]/g, "")))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;
    const outliers = values.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);
    if (outliers.length > 0 && outliers.length < values.length * 0.1) {
      insights.push({
        type: "anomaly",
        title: `${outliers.length} outlier${outliers.length > 1 ? "s" : ""} detected in "${col}"`,
        description: `Found **${outliers.length} outlier value${outliers.length > 1 ? "s" : ""}** in "${col}" that fall outside the expected range (${fmt(q1 - 1.5 * iqr)} to ${fmt(q3 + 1.5 * iqr)}). Most extreme: **${fmt(outliers[outliers.length - 1])}**.`,
        severity: "warning",
        metric: col,
        value: `${outliers.length} outliers`,
      });
    }

    // Top value insight
    insights.push({
      type: "trend",
      title: `"${col}" statistics`,
      description: `Average: **${fmt(stats.mean)}** | Median: **${fmt(stats.median)}** | Total: **${fmt(stats.sum)}**. The ${stats.mean > stats.median ? "mean is above the median, suggesting a right-skewed distribution" : "distribution appears relatively balanced"}.`,
      severity: "success",
      metric: col,
      value: fmt(stats.mean),
    });
  });

  // Analyze categorical columns
  data.categoricalColumns.slice(0, 3).forEach((col) => {
    const counts = getCategoryCounts(data.rows, col);
    if (counts.length === 0) return;

    const topCategory = counts[0];
    const topPct = ((topCategory.value / data.totalRows) * 100).toFixed(1);

    insights.push({
      type: "distribution",
      title: `Top category in "${col}"`,
      description: `"**${topCategory.name}**" is the most frequent value in "${col}", appearing **${topCategory.value} times** (${topPct}% of all rows). There are **${counts.length}** unique values total.`,
      severity: "info",
      metric: col,
      value: topCategory.name,
    });

    // Suggest pie chart
    suggestedCharts.push({
      type: "pie",
      title: `Distribution of ${col}`,
      xKey: "name",
      yKey: "value",
      data: counts,
    });
  });

  // Correlations between numeric columns
  if (data.numericColumns.length >= 2) {
    let strongestCorr = 0;
    let strongestPair: [string, string] = ["", ""];

    for (let i = 0; i < Math.min(data.numericColumns.length, 5); i++) {
      for (let j = i + 1; j < Math.min(data.numericColumns.length, 5); j++) {
        const corr = getCorrelation(data.rows, data.numericColumns[i], data.numericColumns[j]);
        if (Math.abs(corr) > Math.abs(strongestCorr)) {
          strongestCorr = corr;
          strongestPair = [data.numericColumns[i], data.numericColumns[j]];
        }
      }
    }

    if (Math.abs(strongestCorr) > 0.5) {
      const direction = strongestCorr > 0 ? "positive" : "negative";
      const strength = Math.abs(strongestCorr) > 0.8 ? "strong" : "moderate";
      insights.push({
        type: "correlation",
        title: `${strength.charAt(0).toUpperCase() + strength.slice(1)} ${direction} correlation found`,
        description: `"${strongestPair[0]}" and "${strongestPair[1]}" show a **${strength} ${direction} correlation** (r = ${strongestCorr}). ${strongestCorr > 0 ? "As one increases, the other tends to increase as well." : "As one increases, the other tends to decrease."}`,
        severity: strongestCorr > 0 ? "success" : "warning",
        metric: `${strongestPair[0]} × ${strongestPair[1]}`,
        value: `r = ${strongestCorr}`,
      });

      // Scatter chart for correlated columns
      suggestedCharts.push({
        type: "scatter",
        title: `${strongestPair[0]} vs ${strongestPair[1]}`,
        xKey: strongestPair[0],
        yKey: strongestPair[1],
        data: data.rows.slice(0, 200).map((r) => ({
          [strongestPair[0]]: parseFloat((r[strongestPair[0]] || "0").replace(/[,$%\s]/g, "")),
          [strongestPair[1]]: parseFloat((r[strongestPair[1]] || "0").replace(/[,$%\s]/g, "")),
        })).filter((d) => !isNaN(d[strongestPair[0]] as number) && !isNaN(d[strongestPair[1]] as number)),
      });
    }
  }

  // Suggest bar charts for numeric columns
  if (data.categoricalColumns.length > 0 && data.numericColumns.length > 0) {
    const catCol = data.categoricalColumns[0];
    const numCol = data.numericColumns[0];
    const grouped: Record<string, number[]> = {};
    data.rows.forEach((r) => {
      const cat = r[catCol] || "N/A";
      const val = parseFloat((r[numCol] || "0").replace(/[,$%\s]/g, ""));
      if (!isNaN(val)) {
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(val);
      }
    });
    const barData = Object.entries(grouped)
      .map(([name, vals]) => ({
        name,
        average: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
        total: Math.round(vals.reduce((a, b) => a + b, 0) * 100) / 100,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 12);

    suggestedCharts.push({
      type: "bar",
      title: `${numCol} by ${catCol}`,
      xKey: "name",
      yKey: "total",
      data: barData,
    });
  }

  // Line chart if there's a date column
  if (data.dateColumns.length > 0 && data.numericColumns.length > 0) {
    const dateCol = data.dateColumns[0];
    const numCol = data.numericColumns[0];
    const lineData = data.rows
      .map((r) => ({
        [dateCol]: r[dateCol],
        [numCol]: parseFloat((r[numCol] || "0").replace(/[,$%\s]/g, "")),
      }))
      .filter((d) => !isNaN(d[numCol] as number))
      .slice(0, 100);

    suggestedCharts.push({
      type: "line",
      title: `${numCol} over time`,
      xKey: dateCol,
      yKey: numCol,
      data: lineData,
    });
  }

  // Generate narrative
  const narrative = generateNarrative(data, insights);

  // Generate summary
  const summary = `Analyzed ${data.totalRows} rows across ${data.headers.length} columns. Found ${insights.length} insights and generated ${suggestedCharts.length} visualizations.`;

  return {
    summary,
    insights,
    suggestedCharts,
    narrative,
    dataQuality: { score: Math.round(qualityScore), issues: qualityIssues },
  };
}

function generateNarrative(data: ParsedData, insights: Insight[]): string {
  const parts: string[] = [];

  parts.push(
    `## Data Analysis Report\n\nThis dataset contains **${data.totalRows} records** with **${data.headers.length} fields**. `
  );

  if (data.numericColumns.length > 0) {
    const mainCol = data.numericColumns[0];
    const stats = getColumnStats(data.rows, mainCol);
    if (stats) {
      parts.push(
        `The primary numeric field "${mainCol}" has a mean of **${fmt(stats.mean)}** and ranges from ${fmt(stats.min)} to ${fmt(stats.max)}. `
      );
    }
  }

  const anomalies = insights.filter((i) => i.type === "anomaly");
  if (anomalies.length > 0) {
    parts.push(
      `\n\n### ⚠️ Attention Points\n\n${anomalies.map((a) => `- ${a.description}`).join("\n")}`
    );
  }

  const correlations = insights.filter((i) => i.type === "correlation");
  if (correlations.length > 0) {
    parts.push(
      `\n\n### 🔗 Relationships\n\n${correlations.map((c) => `- ${c.description}`).join("\n")}`
    );
  }

  const distributions = insights.filter((i) => i.type === "distribution");
  if (distributions.length > 0) {
    parts.push(
      `\n\n### 📊 Key Distributions\n\n${distributions.slice(0, 3).map((d) => `- ${d.description}`).join("\n")}`
    );
  }

  parts.push(
    `\n\n### 💡 Recommendations\n\n- Focus on the ${data.numericColumns.length > 0 ? `"${data.numericColumns[0]}"` : "primary"} metric for key decisions\n- ${anomalies.length > 0 ? "Investigate the detected outliers before drawing conclusions" : "Data appears clean with no major anomalies"}\n- ${correlations.length > 0 ? "Leverage the discovered correlations for predictive insights" : "Consider collecting more data points to discover relationships"}`
  );

  return parts.join("");
}
