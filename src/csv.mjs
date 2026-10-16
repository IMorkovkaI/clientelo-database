// Shared by browser downloads and build-time research exports.
export function safeCell(value) {
  const text = String(value ?? "");
  return /^\s*[=+@-]/u.test(text) || /^[\t\r\n]/u.test(text)
    ? `'${text}`
    : text;
}

export function toCsv(rows, headers = Object.keys(rows[0] ?? {})) {
  if (!headers.length) return "";
  const escape = (value) => `"${safeCell(value).replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    [headers, ...rows.map((row) => headers.map((key) => row[key]))]
      .map((row) => row.map(escape).join(","))
      .join("\r\n")
  );
}
