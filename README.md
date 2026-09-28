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
  index.html            recipe listing, published via GitHub Pages
  assets/style.css       shared web styling
  recipes/*.html         one hand-written HTML grid per recipe
  recipes/template.html  copy this to start a new recipe's web page
  recipes/*.pdf          synced from recipes/*.pdf by `make docs`
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

Each recipe also gets a hand-written HTML page under `docs/recipes/`
so it renders natively (no PDF viewer) when published with GitHub
Pages. The LaTeX `tblr` grid and the HTML `<table>` are two separate
files describing the same layout — there's no generator between
them, so when you add or change a recipe, update both:

```bash
cp docs/recipes/template.html docs/recipes/my-recipe.html
```

The mechanics mirror the LaTeX version directly:

- **Row merge** — `<td rowspan="3">mix</td>` starts a cell spanning 3
  rows down; every row after the first that it covers must omit that
  `<td>` entirely.
- **Column merge** — `<td colspan="5">...</td>` spans across all 5
  columns, used for the pan-prep / oven-preheat banner rows.
- Add a `<li>` card for the new recipe to [`docs/index.html`](docs/index.html).

Shared web styling (green grid lines, colors, fonts, dark mode) lives
in [`docs/assets/style.css`](docs/assets/style.css).

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
