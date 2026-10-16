# Investor Atlas visual system

Light desktop research workspace with cool neutral surfaces, charcoal text, muted blue actions, and amber evidence gaps. Segoe UI/system sans, 15px base text, 14px secondary copy, tabular financial numbers. Spacing: 4/8/12/16/24/32px. Thin borders, modest radii, restrained drawer shadow. Stable header with Investors, Final draft count, and Methodology. Compact divided investor rows, left filters, right evidence drawer. Draft is an editable table. Comparison is a labeled grid with sticky names. Mobile uses a filter drawer and stacked draft rows. No decoration-only animation.

The user reviews dense evidence on a laptop in daylight, so the workspace stays light and quiet. Shared surface, text and action tokens use OKLCH. Final draft makes Download Excel primary and Download CSV secondary, with a count and short description beside them. Format-specific loading labels and disabled states explain export progress. Notes use visible input boundaries and 13px text. Preserve this hierarchy on mobile without hiding overflow.

## Design review reference

Use [How to stop your frontend looking AI-generated](https://medium.com/design-bootcamp/how-to-stop-your-frontend-looking-ai-generated-efbb9681a6a2) as a review guide: make deliberate choices, keep one accent and consistent neutrals, use clear action labels, avoid decorative gradients and repeated card grids, and check focus, loading, empty and error states. Record concrete issues and fix their shared cause.

Apply the advice to this research tool. Keep the system font for dense tables, native controls and offline use. Keep the blue accent for actions and selection, with amber reserved for uncertainty. Use real research counts and sourced claims. Changing a font, icon library or palette just to look different is not a goal.
