import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
const data = JSON.parse(
  readFileSync(new URL("../../data/investors.json", import.meta.url), "utf8"),
);
const exclusions = JSON.parse(
  readFileSync(
    new URL(
      "../../data/intake/exclusion-checks-2026-10-16.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
import ExcelJS from "exceljs";
test("CVCA additions expose evidence, partial tickets and draft selection", async ({
  page,
}) => {
  await page.goto("/");
  const additions = [
    ["directory-4", "DEPO Ventures", "Tatum"],
    ["directory-9", "i&i Bio", "iQure"],
    ["directory-12", "Inven Capital", "Vytal"],
    ["directory-22", "Tilia Impact Ventures", "FaceUp"],
    ["directory-13", "Jet Ventures (Jet Investment)", "Headmade Materials"],
    ["cvca-jsk-investments", "JSK Investments — Venture Capital", "MintNeuro"],
  ];
  for (const [id, name, company] of additions) {
    await page.getByLabel("Search investors", { exact: true }).fill(name);
    const card = page.getByTestId("investor-" + id);
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: "View profile & evidence" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(company);
    await expect(dialog).toContainText("Scope: eligible");
    await expect(dialog).toContainText("AI source review");
    if (id === "directory-13")
      await expect(dialog).toContainText("No complete range published");
    if (id === "cvca-jsk-investments")
      await expect(dialog).toContainText("No upper");
    await dialog
      .getByRole("button", {
        name: "Add " + name + " to Final draft",
        exact: true,
      })
      .click();
    await page.keyboard.press("Escape");
  }
  await page.getByRole("button", { name: /Final draft 6/ }).click();
  await page.reload();
  for (const [, name] of additions)
    await expect(
      page.getByLabel("Note for " + name, { exact: true }),
    ).toBeVisible();
});

test("research review provenance and retrospective dates are visible", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByTestId("investor-presto")
    .getByRole("button", { name: "View profile & evidence" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("AI source review", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("Evidence published:");
  await expect(dialog).toContainText("retrospectively confirms");
  await expect(dialog).toContainText("2022");
  await page.keyboard.press("Escape");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Methodology", exact: true })
    .click();
  await expect(
    page.getByRole("row").filter({ hasText: "AI source reviews completed" }),
  ).toContainText(String(data.investors.length));
  await expect(
    page.getByRole("row").filter({ hasText: "Pilot inclusion checks met" }),
  ).toContainText(String(data.investors.length));
  const response = await page.request.get("/data/source-reviews.json");
  expect(response.ok()).toBe(true);
  const ledger = await response.json();
  expect(ledger.reviews).toHaveLength(data.investors.length);
  await expect(
    page.getByRole("heading", { name: /Remaining research/ }),
  ).toHaveCount(0);
  expect(
    ledger.reviews.every(
      (r: { reviewerType: string; independent: boolean }) =>
        r.reviewerType === "ai" && !r.independent,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Worldwide expansion scenarios" }),
  ).toBeVisible();
  await expect(
    page.getByText("The pilot includes a scoped manual accuracy check.", {
      exact: false,
    }),
  ).toBeVisible();
  for (const name of [
    "Assignment assessment",
    "Research plan",
    "Pilot evaluation",
    "Investment sources and dates",
    "Coverage and cost assumptions",
    "Calculated budget",
  ]) {
    const link = page.getByRole("link", { name, exact: true });
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    const report = await page.request.get(href!);
    expect(report.ok()).toBe(true);
    expect(await report.text()).toMatch(/^# /);
  }
  await page.setViewportSize({ width: 320, height: 800 });
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewport);
});
test("search, evidence and draft persist across navigation and reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find your next investor." }),
  ).toBeVisible();
  await page.getByLabel("Search investors", { exact: true }).fill("Look");
  await expect(page.getByTestId("investor-look")).toBeVisible();
  await expect(page.getByTestId("investor-jt")).toHaveCount(0);
  await page.getByRole("button", { name: "View profile & evidence" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sodex Innovations", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .locator("summary")
    .filter({ hasText: "View evidence" })
    .first()
    .click();
  await expect(
    page.getByRole("link", { name: "Open original source" }).first(),
  ).toHaveAttribute("href", /^https:/);
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Add Look AI Ventures to Final draft",
      exact: true,
    })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: /Final draft 1/ }).click();
  await page
    .getByLabel("Note for Look AI Ventures", { exact: true })
    .fill("AI fit, confirm ticket.");
  await page.reload();
  await expect(
    page.getByLabel("Note for Look AI Ventures", { exact: true }),
  ).toHaveValue("AI fit, confirm ticket.");
  await page
    .getByRole("button", { name: "Back to results", exact: true })
    .click();
  await expect(
    page.getByLabel("Search investors", { exact: true }),
  ).toHaveValue("Look");
});
test("filters, empty state and unknown ticket handling", async ({ page }) => {
  await page.goto("/");
  await page
    .getByLabel("Search investors", { exact: true })
    .fill("Look AI Ventures");
  await page
    .getByLabel("Company stage", { exact: true })
    .selectOption("Growth");
  await page.getByLabel("Must match stage", { exact: true }).check();
  await page.getByLabel("Include unknown values", { exact: true }).uncheck();
  await expect(
    page.getByRole("heading", { name: "No investors match these filters" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(page.getByTestId("investor-jt")).toBeVisible();
  await page.getByLabel("Investment amount", { exact: true }).fill("500000");
  await page.getByLabel("Must match ticket", { exact: true }).check();
  await expect(page.getByTestId("investor-look")).toContainText(
    "Essential info missing",
  );
});
test("new profiles, unknown toggle and excluded investors keep counts honest", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".investor-row")).toHaveCount(
    data.investors.length,
  );
  await expect(page.locator(".results-toolbar h2")).toHaveText(
    `${data.investors.length} of ${data.investors.length} eligible profiles`,
  );
  for (const control of exclusions.records) {
    await page
      .getByLabel("Search investors", { exact: true })
      .fill(control.name);
    await expect(page.locator(".investor-row")).toHaveCount(0);
  }
  await page.getByLabel("Search investors", { exact: true }).fill("Reflex");
  await page.getByLabel("Investment amount", { exact: true }).fill("500000");
  await page.getByLabel("Must match ticket", { exact: true }).check();
  await expect(page.getByTestId("investor-reflex")).toContainText(
    "Essential info missing",
  );
  await page.getByLabel("Include unknown values", { exact: true }).uncheck();
  await expect(page.locator(".investor-row")).toHaveCount(0);
  await page.getByLabel("Include unknown values", { exact: true }).check();
  await expect(page.locator(".investor-row")).toHaveCount(1);
});
test("Final draft CSV preserves order, unknowns, evidence and safe multiline notes", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const name of ["Rockaway Ventures", "Reflex Capital", "J&T Ventures"])
    await page
      .getByRole("button", { name: `Add ${name} to Final draft`, exact: true })
      .click();
  await page.getByRole("button", { name: /Final draft 3/ }).click();
  await page
    .getByRole("button", { name: "Move Reflex Capital up", exact: true })
    .click();
  const note = '=SUM(1,2)\nConfirm "ticket", then contact. Ověřit €500k.';
  await page.getByLabel("Note for Reflex Capital", { exact: true }).fill(note);
  await page.reload();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV", exact: true }).click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toBe("investor-final-draft.csv");
  const savedFile = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(savedFile);
  const bytes = await readFile(savedFile);
  expect([...bytes.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
  const sheet = await new ExcelJS.Workbook().csv.readFile(savedFile, {
    map: (value) => value,
  });
  const headers = sheet.getRow(1).values as string[];
  const cell = (row: number, key: string) =>
    sheet.getRow(row).getCell(headers.indexOf(key)).value;
  expect(sheet.rowCount).toBe(4);
  expect([2, 3, 4].map((r) => cell(r, "name"))).toEqual([
    "Reflex Capital",
    "Rockaway Ventures",
    "J&T Ventures",
  ]);
  expect(cell(2, "note")).toBe("'" + note);
  expect(cell(2, "ticket_status")).toBe("not_found");
  expect(cell(3, "capital_status")).toBe("not_found");
  expect(cell(2, "sources")).toContain("https://www.jtventures.cz/blog");
  expect(cell(3, "evidence_publication_date")).toBe("2025-12-19");
  expect(cell(3, "individual_contribution")).toBe("");
  expect(cell(4, "legal_identity_note")).toContain("08220867");
  await expect(page.getByRole("status")).toContainText("CSV download started");
});
test("reorder, compare, remove, undo and CSV export", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const name of ["J&T Ventures", "Look AI Ventures", "Presto Ventures"])
    await page
      .getByRole("button", { name: `Add ${name} to Final draft`, exact: true })
      .click();
  await page.getByRole("button", { name: /Final draft 3/ }).click();
  await page
    .getByRole("button", { name: "Move Look AI Ventures up", exact: true })
    .click();
  await expect(page.locator(".draft-table tbody tr").first()).toContainText(
    "Look AI Ventures",
  );
  await page.getByLabel("Compare J&T Ventures", { exact: true }).check();
  await page.getByLabel("Compare Look AI Ventures", { exact: true }).check();
  await page.getByRole("button", { name: /Compare selected/ }).click();
  await expect(
    page.getByRole("heading", { name: "Compare your choices." }),
  ).toBeVisible();
  await page.getByLabel("Show differences only", { exact: true }).check();
  await page
    .getByLabel("Comparison note for Look AI Ventures", { exact: true })
    .fill("Compare note");
  await page
    .getByRole("button", { name: "Back to Final draft", exact: true })
    .click();
  await expect(
    page.getByLabel("Note for Look AI Ventures", { exact: true }),
  ).toHaveValue("Compare note");
  await page
    .getByRole("button", {
      name: "Remove Presto Ventures from Final draft",
      exact: true,
    })
    .click();
  await expect(page.locator(".draft-table tbody tr")).toHaveCount(2);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".draft-table tbody tr")).toHaveCount(3);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV", exact: true }).click();
  const downloaded = await download;
  expect(downloaded.suggestedFilename()).toBe("investor-final-draft.csv");
  expect(await downloaded.failure()).toBeNull();
  const savedFile = testInfo.outputPath(downloaded.suggestedFilename());
  await downloaded.saveAs(savedFile);
  const csv = await readFile(savedFile, "utf8");
  expect(csv).toContain("Compare note");
  expect(csv).toContain("agent_reviewed");
  expect(csv).toContain("not_performed");
});
test("Excel export creates a real workbook", async ({ page }, testInfo) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Add J&T Ventures to Final draft",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /Final draft 1/ }).click();
  const pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download Excel", exact: true })
    .click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("investor-final-draft.xlsx");
  expect(await download.failure()).toBeNull();
  const file = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file!);
  expect(workbook.getWorksheet("Final draft")?.rowCount).toBe(2);
  expect(workbook.getWorksheet("Evidence")?.rowCount).toBeGreaterThan(1);
});

test("empty draft disables exports and failed Excel loading leaves CSV usable", async ({
  page,
}, testInfo) => {
  await page.goto("/#final-draft");
  await expect(
    page.getByRole("button", { name: "Download CSV", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Download Excel", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("Add an investor to enable downloads", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore investors", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Add J&T Ventures to Final draft",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /Final draft 1/ }).click();
  let failChunk!: () => void;
  const chunkBlocked = new Promise<void>((resolve) => {
    failChunk = resolve;
  });
  await page.route(/exceljs[^/]*\.js$/, async (route) => {
    await chunkBlocked;
    await route.abort("failed");
  });
  await page
    .getByRole("button", { name: "Download Excel", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Preparing Excel…", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Download CSV", exact: true }),
  ).toBeDisabled();
  failChunk();
  await expect(page.getByRole("status")).toContainText(
    "Export failed. Please try again.",
  );
  await expect(
    page.getByRole("button", { name: "Download Excel", exact: true }),
  ).toBeEnabled();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV", exact: true }).click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  const savedFile = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(savedFile);
  expect(await readFile(savedFile, "utf8")).toContain("J&T Ventures");
});
for (const width of [320, 390, 560]) {
  for (const font of ["default", "wide fallback"]) {
    test(`mobile layout and filters do not overflow (${width}px, ${font})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      if (font === "wide fallback") {
        await page.evaluate(() => {
          document.documentElement.style.fontFamily = "monospace";
        });
      }
      const checkLayout = async () => {
        const layout = await page.evaluate(() => ({
          viewport: window.innerWidth,
          width: document.documentElement.scrollWidth,
          overflowing: [...document.querySelectorAll("body *")]
            .filter(
              (el) => el.getBoundingClientRect().right > window.innerWidth,
            )
            .map((el) => ({
              tag: el.tagName,
              className: el.getAttribute("class"),
              right: el.getBoundingClientRect().right,
            })),
        }));
        expect(layout.width, JSON.stringify(layout)).toBeLessThanOrEqual(
          layout.viewport,
        );
      };
      await checkLayout();
      await page.getByRole("button", { name: "Filters", exact: true }).click();
      await page
        .getByLabel("Company stage", { exact: true })
        .selectOption("Seed");
      await page.getByRole("button", { name: /Show \d+ investors/ }).click();
      await page
        .getByRole("button", {
          name: "Add J&T Ventures to Final draft",
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: /Final draft 1/ }).click();
      await checkLayout();
      await page
        .getByRole("button", { name: "Back to results", exact: true })
        .click();
      await page
        .getByRole("button", {
          name: "Add Look AI Ventures to Final draft",
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: /Final draft 2/ }).click();
      await checkLayout();
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      for (const button of await navigation.getByRole("button").all()) {
        await expect(button).toBeInViewport();
      }
      await page.screenshot({
        path: `test-results/mobile-draft-${width}-${font.replaceAll(" ", "-")}.png`,
        fullPage: true,
      });
    });
  }
}
test("main screens and detail panel have no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  for (const target of ["results", "details", "draft", "methodology"]) {
    if (target === "details")
      await page
        .getByTestId("investor-jt")
        .getByRole("button", { name: "View profile & evidence" })
        .click();
    if (target === "draft") {
      await page.keyboard.press("Escape");
      await page
        .getByRole("button", {
          name: "Add J&T Ventures to Final draft",
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: /Final draft 1/ }).click();
    }
    if (target === "methodology")
      await page
        .getByRole("navigation")
        .getByRole("button", { name: "Methodology", exact: true })
        .click();
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scan.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      ),
      target,
    ).toEqual([]);
  }
});
test("desktop screenshot and no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/desktop-results.png",
    fullPage: true,
  });
  for (const name of ["J&T Ventures", "Look AI Ventures", "Reflex Capital"])
    await page
      .getByRole("button", { name: `Add ${name} to Final draft`, exact: true })
      .click();
  await page.getByRole("button", { name: /Final draft 3/ }).click();
  await page
    .getByLabel("Note for J&T Ventures", { exact: true })
    .fill("Confirm the ticket and discuss a first introduction.");
  await page.screenshot({
    path: "test-results/desktop-draft.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
