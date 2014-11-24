# Makefile see: https://www.gnu.org/prep/standards/html_node/Standard-Targets.html

javascript_src = src/javascripts
javascripts_jsx = $(shell find $(javascript_src) -type f -name "*.js")
javascripts = $(patsubst $(javascript_src)/%,build/%, $(javascripts_jsx))

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
	./node_modules/.bin/lessc -x $< > $@

public/stylesheets/application.css: src/stylesheets/*.less
	./node_modules/.bin/lessc src/stylesheets/index.less > $@

public/dev.html: node_modules $(javascripts) public/javascripts/application.js public/stylesheets/application.css
	node build/index.js > $@

public/index.html: node_modules $(javascripts) public/javascripts/application.min.js public/stylesheets/application.min.css
	node build/index.js --dist > $@

build/%: src/javascripts/%
	mkdir -p $(shell dirname $@)
	./node_modules/.bin/jsx $< > $@

public/javascripts/application.js: $(javascripts) package.json node_modules/**/*
	./node_modules/.bin/browserify build/index.js > $@

public/javascripts/application.min.js: public/javascripts/application.js
	ruby -r 'rubygems' -r 'closure-compiler' -e "puts Closure::Compiler.new(:warning_level => 'DEFAULT', :compilation_level => 'SIMPLE_OPTIMIZATIONS').compile(STDIN)" < $< > $@
