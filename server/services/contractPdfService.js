
import puppeteer from "puppeteer";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatMoney = (amount, currency = "INR") => {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) return "Not specified";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-IN")}`;
  }
};

const buildContractHtml = (contract) => {
  const clauses = (contract.clauses || [])
    .map(
      (clause, index) => `
        <section class="clause">
          <h2>${index + 1}. ${escapeHtml(clause.title)}</h2>
          <div class="clause-content">${escapeHtml(clause.content)
            .replace(/\r\n|\r|\n/g, "<br>")}</div>
        </section>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(contract.title)}</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 20mm 24mm;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: #202938;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
    }

    .top-line {
      height: 5px;
      background: #183b56;
      margin-bottom: 28px;
    }

    .eyebrow {
      color: #637487;
      font-size: 9pt;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    h1 {
      color: #183b56;
      font-size: 27pt;
      line-height: 1.2;
      margin: 8px 0 12px;
      overflow-wrap: anywhere;
    }

    .contract-number {
      color: #637487;
      font-size: 9pt;
    }

    .summary {
      background: #f3f6f9;
      border: 1px solid #e1e7ed;
      border-radius: 6px;
      padding: 16px 18px;
      margin: 26px 0;
    }

    .summary-row {
      display: flex;
      gap: 18px;
      margin: 8px 0;
    }

    .label {
      width: 135px;
      flex-shrink: 0;
      color: #637487;
      font-size: 9pt;
      font-weight: bold;
    }

    .value {
      flex: 1;
      overflow-wrap: anywhere;
    }

    h2 {
      color: #183b56;
      font-size: 12pt;
      margin: 22px 0 8px;
      break-after: avoid;
    }

    p { margin: 8px 0 14px; }

    .clause {
      break-inside: auto;
    }

    .clause-content {
      overflow-wrap: anywhere;
      white-space: normal;
    }

    .signature-grid {
      display: flex;
      gap: 35px;
      margin-top: 55px;
      break-inside: avoid;
    }

    .signature {
      flex: 1;
      min-width: 0;
    }

    .signature-line {
      border-top: 1px solid #8794a2;
      margin-top: 55px;
      padding-top: 8px;
      font-size: 9pt;
    }

    .muted { color: #637487; }

    .empty-clauses {
      color: #637487;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="top-line"></div>

  <div class="eyebrow">Contract Agreement</div>
  <h1>${escapeHtml(contract.title)}</h1>
  <div class="contract-number">
    Contract No: ${escapeHtml(contract.contractNumber || "Pending")}
  </div>

  <div class="summary">
    <div class="summary-row">
      <div class="label">Client</div>
      <div class="value">${escapeHtml(contract.clientName)}</div>
    </div>
    <div class="summary-row">
      <div class="label">Client Email</div>
      <div class="value">${escapeHtml(contract.clientEmail || "Not specified")}</div>
    </div>
    <div class="summary-row">
      <div class="label">Freelancer</div>
      <div class="value">${escapeHtml(contract.freelancerName || "Not specified")}</div>
    </div>
    <div class="summary-row">
      <div class="label">Project Fee</div>
      <div class="value">${escapeHtml(formatMoney(contract.paymentAmount, contract.currency))}</div>
    </div>
    <div class="summary-row">
      <div class="label">Start Date</div>
      <div class="value">${escapeHtml(formatDate(contract.startDate))}</div>
    </div>
    <div class="summary-row">
      <div class="label">End Date</div>
      <div class="value">${escapeHtml(formatDate(contract.endDate))}</div>
    </div>
  </div>

  <h2>Project Description</h2>
  <p>${escapeHtml(contract.projectDescription || "No project description provided.")
    .replace(/\r\n|\r|\n/g, "<br>")}</p>

  <h2>Payment Terms</h2>
  <p>${escapeHtml(contract.paymentTerms || "No payment terms specified.")
    .replace(/\r\n|\r|\n/g, "<br>")}</p>

  <h2>Terms and Conditions</h2>
  ${
    clauses ||
    '<p class="empty-clauses">No clauses have been added to this contract.</p>'
  }

  <div class="signature-grid">
    <div class="signature">
      <div class="signature-line">Client Signature / Date</div>
    </div>
    <div class="signature">
      <div class="signature-line">Freelancer Signature / Date</div>
    </div>
  </div>
</body>
</html>`;
};

export const generateContractPdf = async (contract) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(buildContractHtml(contract), {
      waitUntil: "load",
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size:8px;width:100%;margin:0 20mm;color:#637487;"></div>',
      footerTemplate: `
        <div style="font-size:8px;width:100%;margin:0 20mm;display:flex;justify-content:space-between;color:#637487;">
          <span>Confidential Contract</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: "22mm",
        right: "20mm",
        bottom: "24mm",
        left: "20mm",
      },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
