# Security review

Handoff follow-up: the dependency audit again reported zero known vulnerabilities on 16 October 2026. The 55-test pass covers CSV formula protection, URL/date validation, scope exclusions and the new legal-entity exports. A basic scan of publication files found no matching private-key or common access-token patterns; this is not a Git-history scan. ARES research adds static public data and no runtime API or credentials. The later user-authorized run passed 17 production E2E tests, including actual CSV/Excel saves and export failure recovery. Remote headers and deployment remain unverified. See [validation](../docs/VALIDATION.md).

Reviewed 16 October 2026 with OWASP Security Check. Scope: React static SPA, public JSON data, browser-local notes, CSV/Excel generation, build scripts and GitHub Pages workflow. This is a code/dependency review, not a penetration test or a security certification.

## Corrected findings

| Severity | Category              | Location                                  | Issue and impact                                                                                                                                            | Fix                                                                                                           |
| -------- | --------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Medium   | Input/output security | src/csv.mjs:9; scripts/prepare-data.mjs:8 | Generated CSV escaped quotes but allowed source-controlled formula prefixes. A spreadsheet could interpret a malicious cell as a formula.                   | Both export paths share safeCell/toCsv; regression checks cover prefixes, whitespace, quotes and line breaks. |
| Medium   | Data integrity        | scripts/validate-data.mjs:227             | AI review could be relabeled human-reviewed by changing one status, misleading exported provenance.                                                         | Preview pipeline rejects human status; no automatic upgrade or publication.                                   |
| Low      | Input validation      | scripts/validate-data.mjs:8               | Prefix-only URL validation accepted malformed URLs or embedded credentials; malformed currencies/dates/numbers could break formatting or misstate evidence. | Parse HTTPS URLs, reject credentials, validate dates and financial values, enforce supported-list contents.   |

CSV defense uses `safeCell(value)` before quoting every value and header. ExcelJS writes string cell values rather than formula objects. Export safety reduces formula risk; later editing or re-saving in other spreadsheet applications can change how cells are interpreted.

## Checks and boundaries

- No credentials or private investor records were found in the inspected tracked source paths. This was not a historical Git secret scan.
- React renders notes and source excerpts as text; no dangerous HTML rendering, eval or command execution path was found in the app. External evidence links use HTTPS and safe new-tab attributes.
- Production CSP restricts scripts/styles/connect destinations to self and disables objects and forms. There are no runtime third-party scripts or data calls. The large ExcelJS module remains lazy loaded.
- No server, login, database, privileged API, file upload or session exists in this pilot. Server authorization, SQL injection, CSRF and token-storage controls are not applicable to the present architecture; adding a backend would require a new review.
- Draft notes live in localStorage, are not encrypted, and do not sync. The UI/README describe that device-local behavior. Public JSON and reports must remain public information.
- GitHub Actions uses read-only repository permissions in the test job and grants Pages deployment permissions only to the deployment job. Tests and dependency audit gate deployment; no bypass was added.
- Fresh `npm audit --audit-level=moderate` returned zero reported vulnerabilities. This is the registry advisory result, not proof that dependencies have no defects.
- Header-only controls such as frame-ancestors, HSTS and X-Content-Type-Options cannot be supplied by a static HTML meta tag. GitHub Pages controls response headers. No ineffective meta substitutes were added; deployment headers were not verified in this pass.

The earlier download failure also affected a plain-text data URL. Paired controls isolated the sandbox temporary-directory access problem; project-local browser temporary files restored successful saves. All 17 production E2E tests now pass, including strict CSV/Excel checks. The app reports download initiation, without claiming it can observe the browser's final save. See [validation](../docs/VALIDATION.md).
