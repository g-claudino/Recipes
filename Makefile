TEXINPUTS := ./templates:$(TEXINPUTS)
export TEXINPUTS

SOURCES := $(filter-out recipes/TEMPLATE.tex,$(wildcard recipes/*.tex))
PDFS := $(SOURCES:.tex=.pdf)

.PHONY: all clean watch

all: $(PDFS)

recipes/%.pdf: recipes/%.tex templates/recipe-matrix.sty
	latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=recipes $<

clean:
	latexmk -c -outdir=recipes
	rm -f recipes/*.pdf

# Rebuild a recipe on every save, e.g. `make watch RECIPE=brownies`
watch:
	latexmk -lualatex -pvc -interaction=nonstopmode -outdir=recipes recipes/$(RECIPE).tex
