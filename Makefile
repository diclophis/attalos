# Makefile see: https://www.gnu.org/prep/standards/html_node/Standard-Targets.html

javascript_src = src/javascripts
javascripts_jsx = $(shell find $(javascript_src) -type f -name "*.js")
javascripts = $(patsubst $(javascript_src)/%,build/%, $(javascripts_jsx))

debug_js=public/javascripts/application.js
debug_css=public/stylesheets/application.css
dist_js=public/javascripts/application.min.js
dist_css=public/stylesheets/application.min.css

.PHONY: all check clean

dev: public/dev.html

debug:
	echo $(javascripts)
	echo $(javascripts_jsx)

all: check dev dist

dist: public/index.html

check: node_modules $(javascripts)
	./node_modules/.bin/jest

clean:
	rm -Rf build public/javascripts/application.* public/stylesheets/application.* public/index.html
	mkdir -p build public/javascripts public/stylesheets

dist-clean:
	rm -Rf node_modules

node_modules: package.json
	npm install

public/stylesheets/application.min.css: public/stylesheets/application.css
	mkdir -p $(shell dirname $@)
	./node_modules/.bin/lessc -x $< > $@

public/stylesheets/application.css: src/stylesheets/*.less
	mkdir -p $(shell dirname $@)
	./node_modules/.bin/lessc src/stylesheets/index.less > $@

public/dev.html: node_modules $(javascripts) $(debug_js) $(debug_css)
	node -p -e "require('./build/index.js').render(\"javascripts/application.js?$(shell shasum $(debug_js) | cut -f1 -d' ')\", \"stylesheets/application.css?$(shell shasum $(debug_css) | cut -f1 -d' ')\")" > $@

public/index.html: node_modules $(javascripts) $(dist_js) $(dist_css)
	node -p -e "require('./build/index.js').render(\"javascripts/application.min.js?$(shell shasum $(dist_js) | cut -f1 -d' ')\", \"stylesheets/application.min.css?$(shell shasum $(dist_css) | cut -f1 -d' ')\")" > $@

build/%: src/javascripts/%
	mkdir -p $(shell dirname $@)
	./node_modules/.bin/jsx $< > $@

public/javascripts/application.js: $(javascripts) package.json node_modules/**/*
	mkdir -p $(shell dirname $@)
	./node_modules/.bin/browserify --standalone Attalos build/index.js > $@

public/javascripts/application.min.js: public/javascripts/application.js
	mkdir -p $(shell dirname $@)
	ruby -r 'rubygems' -r 'closure-compiler' -e "puts Closure::Compiler.new(:warning_level => 'QUIET', :compilation_level => 'SIMPLE_OPTIMIZATIONS').compile(STDIN)" < $< > $@
