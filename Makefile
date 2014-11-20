# OSX Makefile

build: public/index.html

public/stylesheets/application.css: src/stylesheets/*.less
	./node_modules/.bin/lessc src/stylesheets/index.less > $@

public/stylesheets/application.min.css: public/stylesheets/application.css
	./node_modules/.bin/lessc -x $< > $@

public/javascripts/application.js: src/javascripts/*.js package.json node_modules/**/*
	./node_modules/.bin/browserify -t reactify src/javascripts/index.js > $@

public/javascripts/application.min.js: public/javascripts/application.js
	ruby -r 'rubygems' -r 'closure-compiler' -e "puts Closure::Compiler.new(:warning_level => 'QUIET', :compilation_level => 'SIMPLE_OPTIMIZATIONS').compile(STDIN)" < $< > $@

public/index.html: public/javascripts/application.min.js public/stylesheets/application.min.css
	./node_modules/.bin/browserify --exclude crypt --exclude node-uuid --exclude stanza.io -t reactify src/javascripts/index.js | node > $@

clean:
	rm -f public/javascripts/application.min.js public/stylesheets/application.min.css public/index.html
