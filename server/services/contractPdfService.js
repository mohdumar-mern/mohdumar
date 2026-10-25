import puppeteer from "puppeteer";
import sanitizeHtml from "sanitize-html";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatMoney = (amount, currency = "USD") => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${escapeHtml(currency)} ${escapeHtml(amount ?? "")}`;
  }

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(numericAmount);
  } catch {
    return `${escapeHtml(currency)} ${numericAmount.toFixed(2)}`;
  }
};

const cleanRichText = (html = "") =>
  sanitizeHtml(String(html), {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  });

const renderParagraph = (value) => {
  if (!value) return '<p class="muted">Not specified</p>';

  // These fields are plain text, not trusted HTML.
  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
};

const renderClauses = (clauses = []) => {
  if (!Array.isArray(clauses) || clauses.length === 0) {
    return `
      <p class="muted">
        No additional clauses have been provided.
      </p>
    `;
  }

  return clauses
    .map((clause, index) => {
      const title = escapeHtml(clause.title || `Clause ${index + 1}`);
      const content = cleanRichText(clause.content || "");

      return `
        <section class="clause">
          <h3>${index + 1}. ${title}</h3>
          <div class="rich-content">
            ${content || '<p class="muted">No details provided.</p>'}
          </div>
        </section>
      `;
    })
    .join("");
};

const buildContractHtml = (contract) => {
  const title = escapeHtml(contract.title || "Freelance Service Agreement");
  const contractNumber = escapeHtml(contract.contractNumber || "Not assigned");
  const clientName = escapeHtml(contract.clientName || "Not specified");
  const clientEmail = escapeHtml(contract.clientEmail || "Not specified");
  const freelancerName = escapeHtml(contract.freelancerName || "Not specified");
  const currency = contract.currency || "USD";

  const fee = formatMoney(contract.paymentAmount, currency);
  const startDate = formatDate(contract.startDate);
  const endDate = formatDate(contract.endDate);

  const effectiveDate = formatDate(
    contract.effectiveDate || contract.createdAt || new Date()
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 19mm 23mm;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: #202a35;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }

    .top-line {
      height: 5px;
      margin-bottom: 30px;
      background: #087e8b;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: #087e8b;
      font-size: 9pt;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    h1 {
      margin: 0 0 10px;
      color: #142c3a;
      font-size: 25pt;
      line-height: 1.2;
    }

    .contract-number {
      color: #526474;
      font-size: 10pt;
    }

    .intro {
      margin: 24px 0;
    }

    .section {
      margin-top: 24px;
      break-inside: auto;
    }

    h2 {
      margin: 0 0 12px;
      padding-bottom: 7px;
      border-bottom: 1px solid #cbd8df;
      color: #087e8b;
      font-size: 13pt;
      break-after: avoid;
    }

    h3 {
      margin: 15px 0 6px;
      color: #203b4a;
      font-size: 10.5pt;
      break-after: avoid;
    }

    p { margin: 5px 0 10px; }

    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .party-card {
      padding: 14px;
      border: 1px solid #d9e3e8;
      border-radius: 5px;
      break-inside: avoid;
    }

    .party-label {
      margin-bottom: 8px;
      color: #087e8b;
      font-size: 8pt;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .party-name {
      font-size: 12pt;
      font-weight: bold;
    }

    .details {
      width: 100%;
      border-collapse: collapse;
    }

    .details td {
      padding: 9px 8px;
      border-bottom: 1px solid #e3eaee;
      vertical-align: top;
    }

    .details td:first-child {
      width: 38%;
      color: #526474;
      font-weight: bold;
    }

    .rich-content ul,
    .rich-content ol {
      padding-left: 22px;
    }

    .rich-content li {
      margin: 4px 0;
    }

    .rich-content a {
      color: #087e8b;
      text-decoration: underline;
    }

    .clause {
      margin: 13px 0;
      break-inside: avoid;
    }

    .muted { color: #657786; }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-top: 38px;
    }

    .signature {
      padding-top: 36px;
      border-bottom: 1px solid #526474;
    }

    .signature-label {
      margin-top: 9px;
      font-size: 9pt;
      font-weight: bold;
    }

    .signature-date {
      margin-top: 22px;
      padding-bottom: 5px;
      border-bottom: 1px solid #9aabb5;
    }

    .signature-note {
      margin-top: 16px;
      color: #657786;
      font-size: 8.5pt;
    }

    .footer-note {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #d9e3e8;
      color: #657786;
      font-size: 8pt;
    }

    @media print {
      .party-card { break-inside: avoid; }
      a { color: inherit; }
    }
  </style>
</head>
<body>
  <div class="top-line"></div>

  <header>
    <p class="eyebrow">Freelance Services</p>
    <h1>${title}</h1>
    <div class="contract-number">
      Contract No: ${contractNumber}
    </div>
  </header>

  <div class="intro">
    <p>
      This Freelance Service Agreement ("Agreement") is entered into
      as of <strong>${escapeHtml(effectiveDate)}</strong> by and between
      the client and the service provider identified below.
      The parties agree to the terms set out in this document.
    </p>
  </div>

  <section class="section">
    <h2>1. Parties to the Agreement</h2>
    <div class="parties">
      <div class="party-card">
        <div class="party-label">Client</div>
        <div class="party-name">${clientName}</div>
        <p>${clientEmail}</p>
      </div>
      <div class="party-card">
        <div class="party-label">Freelancer / Service Provider</div>
        <div class="party-name">${freelancerName}</div>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>2. Project and Commercial Details</h2>
    <table class="details">
      <tr><td>Project Fee</td><td>${fee}</td></tr>
      <tr><td>Start Date</td><td>${escapeHtml(startDate)}</td></tr>
      <tr><td>End Date</td><td>${escapeHtml(endDate)}</td></tr>
      <tr><td>Payment Terms</td><td>${
        contract.paymentTerms
          ? escapeHtml(contract.paymentTerms).replace(/\n/g, "<br>")
          : "To be agreed in writing"
      }</td></tr>
    </table>
  </section>

  <section class="section">
    <h2>3. Project Description and Scope</h2>
    ${renderParagraph(contract.projectDescription)}
  </section>

  <section class="section">
    <h2>4. Terms and Conditions</h2>
    ${renderClauses(contract.clauses)}
  </section>

  <section class="section">
    <h2>5. Entire Agreement and Amendments</h2>
    <p>
      This document and its included clauses form the agreement
      between the parties concerning the services described above.
      Any changes should be recorded in writing and accepted by
      both parties. If a provision is found unenforceable, the
      remaining provisions should be considered separately to the
      extent permitted by applicable law.
    </p>
    <p>
      The parties should review this Agreement and complete any
      required details before signing.
    </p>
  </section>

  <section class="section">
    <h2>6. Signatures</h2>
    <p>
      By signing below, each party confirms that they have reviewed
      this Agreement and intend to agree to its terms.
    </p>

    <div class="signature-grid">
      <div>
        <div class="signature"></div>
        <div class="signature-label">Client: ${clientName}</div>
        <div class="signature-date">Date:</div>
      </div>
      <div>
        <div class="signature"></div>
        <div class="signature-label">
          Freelancer: ${freelancerName}
        </div>
        <div class="signature-date">Date:</div>
      </div>
    </div>

    <p class="signature-note">
      Signature lines in this PDF are for signing; downloading the
      document does not electronically sign or execute the agreement.
    </p>
  </section>

  <div class="footer-note">
    Confidential — Contract ${contractNumber}
  </div>
</body>
</html>`;
};

export const generateContractPdf = async (contract) => {
  if (!contract) {
    throw new Error("A contract is required to generate a PDF.");
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(buildContractHtml(contract), {
      waitUntil: "networkidle0",
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="
          width: 100%;
          padding: 0 19mm;
          color: #657786;
          font-size: 8px;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: space-between;
        ">
          <span>Freelance Service Agreement</span>
          <span>
            Page <span class="pageNumber"></span>
            of <span class="totalPages"></span>
          </span>
        </div>
      `,
      margin: {
        top: "18mm",
        right: "19mm",
        bottom: "23mm",
        left: "19mm",
      },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
