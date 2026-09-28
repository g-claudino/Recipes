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

## Building

Requires a full TeX Live install (`tabularray`, `fontspec`,
`lualatex`) and the Liberation fonts (`fonts-liberation` on
Debian/Ubuntu, bundled on most Linux desktops already).

```bash
make               # builds every recipe in recipes/ to PDF
make watch RECIPE=brownies   # rebuild on save while editing
make clean
```

CI ([`.github/workflows/build.yml`](.github/workflows/build.yml))
rebuilds every recipe on push/PR to catch LaTeX errors before they
land; it does not auto-commit PDFs, so run `make` locally and commit
the updated PDF alongside your `.tex` changes.

## Publishing

PDFs are tracked in git, so each recipe's rendered version is
visible directly from its file page on GitHub. Push to a public repo
and link individual recipes, e.g.
`https://github.com/<user>/Recipes/blob/main/recipes/brownies.pdf`.
