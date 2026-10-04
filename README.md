# Recipes

Recipes as an editable, readable grid: ingredients down the left,
prep stages across the top, merged cells show what combines with
what. Inspired by a tabular recipe layout (credited to @juanbuis) —
see [`recipes/brownies.tex`](recipes/brownies.tex) for a full
recreation of the original example.

## Layout

```
recipes/
  TEMPLATE.tex   copy this to start a new recipe
  brownies.tex   worked example
  *.pdf          built output, committed alongside the source
templates/
  recipe-matrix.sty   shared fonts, colors, page setup
docs/
  index.html               nav + category tiles + the "All recipes" search/filter grid
  categories/*.html        one page per category, listing its recipe cards
  assets/style.css         shared web styling
  assets/theme.js          light/dark toggle logic
  assets/search.js         powers the nav search box + category chips on index.html
  assets/recipes.json      search index: one entry per recipe (title, category, ingredients, ...)
  assets/images/           recipe/category photos (placeholders until you add real ones)
  recipes/*.html           one hand-written HTML grid per recipe
  recipes/template.html    copy this to start a new recipe's web page
  recipes/*.pdf            synced from recipes/*.pdf by `make docs`
```

## Writing a recipe

```bash
cp recipes/TEMPLATE.tex recipes/my-recipe.tex
```

Each recipe is a `tabularray` grid (`tblr` environment). The
mechanics:

- **Row merge** — `\SetCell[r=3]{c,m,font=\bfseries} mix` starts a
  cell spanning 3 rows down in that column. Every row after the
  first that it covers must skip that column entirely (leave it
  blank between the `&`s).
- **Column merge** — `\SetCell[c=5]{c,font=\bfseries}` spans across
  5 columns instead, used for the pan-prep / oven-preheat banner
  rows at the top.
- Add or remove ingredient rows freely. Add or remove stage columns
  by editing `colspec` and updating every row to match, and keep any
  `r=N` merge counts in sync with how many rows they actually cover.

Shared look (green grid lines, fonts, page margins) lives in
[`templates/recipe-matrix.sty`](templates/recipe-matrix.sty). Change
`recipeaccent` there to re-theme every recipe at once, or override it
per-recipe by redefining the color after `\usepackage{recipe-matrix}`.

## Writing the web version

The site is three layers: [`docs/index.html`](docs/index.html) (category
tiles) → `docs/categories/*.html` (recipe cards per category) →
`docs/recipes/*.html` (the recipe itself). The LaTeX `tblr` grid and
the HTML `<table>` are two separate files describing the same
layout — there's no generator between them, so when you add or
change a recipe, update both.

To add a new recipe:

```bash
cp docs/recipes/template.html docs/recipes/my-recipe.html
```

1. In the new file, set `<body class="cat-entries|cat-mains|cat-desserts">`
   to its category — this colors the grid lines, stage labels, and
   breadcrumb to match.
2. Add a photo (see below).
3. Copy the `<li class="...">` card block from
   [`docs/categories/desserts.html`](docs/categories/desserts.html)
   into the matching category page, pointing at your new recipe.
4. Bump that category's `<span class="count">` on `docs/index.html`.
5. Add an entry to [`docs/assets/recipes.json`](docs/assets/recipes.json)
   (same `slug`/`title`/`category`/`meta`/`photo`/`url` fields as the
   existing one, plus an `ingredients` array of plain-text lines) so
   the recipe shows up in nav search and the "All recipes" filter.
6. Fill in (or delete) the `.pairing` section near the bottom of the
   recipe page with a real drink/side suggestion.

The grid mechanics mirror the LaTeX version directly:

- **Row merge** — `<td rowspan="3">mix</td>` starts a cell spanning 3
  rows down; every row after the first that it covers must omit that
  `<td>` entirely.
- **Column merge** — `<td colspan="5">...</td>` spans across all 5
  columns, used for the pan-prep / oven-preheat banner rows.

Shared web styling (colors, fonts, dark mode, per-category accents)
lives in [`docs/assets/style.css`](docs/assets/style.css). Every page
follows the OS light/dark preference by default, with a toggle button
(top-right) to override it; the choice is remembered per-browser via
`localStorage` ([`docs/assets/theme.js`](docs/assets/theme.js)). New
pages need the `<script src="…assets/theme.js">` tag early in
`<head>` and the `#theme-toggle` button markup right after `<body>`
— copy both from `docs/recipes/template.html`.

### Navigation and search

Every page shares the same `<nav class="site-nav">` bar: a brand
link back to `index.html`, links to each category, an "All recipes"
link, a search box, and the theme toggle. Copy it (and the matching
`<nav class="crumbs">` breadcrumb below it) from
`docs/recipes/template.html` when adding a page — paths are relative,
so `../` prefixes change depending on how deep the new file lives.

Search only *runs* on `index.html` ([`docs/assets/search.js`](docs/assets/search.js)):
the nav search form on every other page is a plain HTML GET form
that submits `?q=...` to `index.html`, which then does the actual
filtering — no JavaScript needed to get there. On `index.html`,
`search.js` fetches `recipes.json`, matches the query against each
recipe's title and ingredients (case-insensitive substring), and
combines it with whichever category chip is active. Typing
live-filters and updates the URL (`?q=...&cat=...`) so results are
shareable and survive a reload.

### Pairing

Each recipe page has a `.pairing` section after the grid — a short
note on what to drink or serve alongside the dish ("harmonização" /
wine-and-food pairing). It's a plain paragraph you edit by hand, no
special markup.

### Photos

There are no real food photos in this repo yet — `docs/assets/images/placeholder-{entries,mains,desserts}.svg`
are stand-ins so the layout looks right immediately. To add a real
photo for a recipe:

1. Drop the image in `docs/assets/images/`, e.g. `brownies.jpg`.
2. Point the recipe page's `.recipe-hero img` and the matching
   `<li>` card's `.thumb img` at it (`src="../assets/images/brownies.jpg"`).
3. Any size works — `object-fit: cover` crops it to fit both the
   hero banner and the card thumbnail.

## Building

Requires a full TeX Live install (`tabularray`, `fontspec`,
`lualatex`) and the Liberation fonts (`fonts-liberation` on
Debian/Ubuntu, bundled on most Linux desktops already).

```bash
make               # builds every recipe to PDF and syncs docs/recipes/*.pdf
make watch RECIPE=brownies   # rebuild on save while editing
make clean
```

CI ([`.github/workflows/build.yml`](.github/workflows/build.yml))
rebuilds every recipe on push/PR to catch LaTeX errors before they
land; it does not auto-commit PDFs, so run `make` locally and commit
the updated PDF (and its `docs/recipes/` copy) alongside your `.tex`
changes.

## Publishing

PDFs are tracked in git, so each recipe's rendered version is also
visible directly from its file page on GitHub, e.g.
`https://github.com/<user>/Recipes/blob/main/recipes/brownies.pdf`.

For the HTML version, push to GitHub then enable Pages: **Settings →
Pages → Build and deployment → Deploy from a branch → `main`,
folder `/docs`**. The site publishes at
`https://<user>.github.io/<repo>/`, with each recipe linked from the
index and reachable directly at
`https://<user>.github.io/<repo>/recipes/brownies.html`.
