# Makefile see: https://www.gnu.org/prep/standards/html_node/Standard-Targets.html

src_less = ./src/stylesheets/index.less
javascript_src = ./src/javascripts
javascripts_jsx = $(shell find $(javascript_src) -type f -name "*.js")
javascripts_jsx_dir = $(shell find $(javascript_src) -type d)
javascripts = $(patsubst $(javascript_src)/%,build/%, $(javascripts_jsx))
javascripts_dir = $(patsubst $(javascript_src)%,build%, $(javascripts_jsx_dir))
public_dirs = ./public ./public/javascripts ./public/stylesheets
output_dirs = $(public_dirs) $(javascripts_dir)
node_modules = ./node_modules

debug_js = ./public/javascripts/application.js
debug_css = ./public/stylesheets/application.css
dist_js = ./public/javascripts/application.min.js
dist_css = ./public/stylesheets/application.min.css
dev_html = ./public/dev.html
dist_html = ./public/index.html

.PHONY: all check clean

dev: $(output_dirs) $(dev_html)

dist: $(output_dirs) $(dist_html)

debug:
	echo $(javascripts_jsx_dir)
	echo $(javascripts_dir)
	echo $(javascripts)
	echo $(javascripts_jsx)

all: check dev dist

check: $(node_modules) $(javascripts)
	./node_modules/.bin/jest

clean:
	rm -Rf $(output_dirs)

dist-clean:
	rm -Rf node_modules

build/npm-install.log: package.json
	npm install

public/stylesheets/application.min.css: $(debug_css)
	./node_modules/.bin/lessc -x $< > $@

$(debug_css): src/stylesheets/*.less
	./node_modules/.bin/lessc $(src_less) > $@

public/dev.html: $(node_modules) $(javascripts) $(debug_js) $(debug_css)
	node -p -e "require('./build/index.js').render(\"javascripts/application.js?$(shell shasum $(debug_js) | cut -f1 -d' ')\", \"stylesheets/application.css?$(shell shasum $(debug_css) | cut -f1 -d' ')\")" > $@

public/index.html: $(node_modules) $(javascripts) $(dist_js) $(dist_css)
	node -p -e "require('./build/index.js').render(\"javascripts/application.min.js?$(shell shasum $(dist_js) | cut -f1 -d' ')\", \"stylesheets/application.min.css?$(shell shasum $(dist_css) | cut -f1 -d' ')\")" > $@

$(output_dirs):
	mkdir -p $@

build/%: src/javascripts/%
	./node_modules/.bin/jsx $< > $@

$(debug_js): $(javascripts) package.json node_modules/**/*
	./node_modules/.bin/browserify --standalone Attalos build/index.js > $@

$(dist_js): $(debug_js)
	ruby -r 'rubygems' -r 'closure-compiler' -e "puts Closure::Compiler.new(:warning_level => 'QUIET', :compilation_level => 'SIMPLE_OPTIMIZATIONS').compile(STDIN)" < $< > $@
