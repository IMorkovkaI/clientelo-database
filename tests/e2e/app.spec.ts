import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
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
test("reorder, compare, remove, undo and CSV export", async ({ page }) => {
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
  await page.getByRole("button", { name: "CSV", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("investor-final-draft.csv");
});
test("Excel export creates a real workbook", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Add J&T Ventures to Final draft",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /Final draft 1/ }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export Excel", exact: true }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("investor-final-draft.xlsx");
  const file = await download.path();
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file!);
  expect(workbook.getWorksheet("Final draft")?.rowCount).toBe(2);
  expect(workbook.getWorksheet("Evidence")?.rowCount).toBeGreaterThan(1);
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
  expect(errors).toEqual([]);
});
