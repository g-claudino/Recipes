TEXINPUTS := ./templates:$(TEXINPUTS)
export TEXINPUTS

SOURCES := $(filter-out recipes/TEMPLATE.tex,$(wildcard recipes/*.tex))
PDFS := $(SOURCES:.tex=.pdf)

.PHONY: all docs clean watch

all: $(PDFS) docs

recipes/%.pdf: recipes/%.tex templates/recipe-matrix.sty
	latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=recipes $<

# Keep the GitHub Pages copies (docs/recipes/*.pdf, linked from the
# matching *.html) in sync with the built PDFs.
docs: $(PDFS)
	@for pdf in $(PDFS); do \
		name=$$(basename $$pdf); \
		if [ -f docs/recipes/$${name%.pdf}.html ]; then \
			cp $$pdf docs/recipes/$$name; \
		fi; \
	done

clean:
	latexmk -c -outdir=recipes
	rm -f recipes/*.pdf

# Rebuild a recipe on every save, e.g. `make watch RECIPE=brownies`
watch:
	latexmk -lualatex -pvc -interaction=nonstopmode -outdir=recipes recipes/$(RECIPE).tex
