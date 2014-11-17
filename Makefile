# OSX Makefile

build: public/javascripts/application.min.js public/stylesheets/application.min.css

public/stylesheets/application.min.css: src/stylesheets/*.less
	./node_modules/.bin/lessc -x src/stylesheets/index.less > $@

#public/javascripts/application.js: src/javascripts/*.js node_modules/**/*
#	./node_modules/.bin/browserify -t reactify src/javascripts/*.js > $@

public/javascripts/application.min.js: src/javascripts/*.js package.json
	./node_modules/.bin/browserify -t reactify package.json src/javascripts/*.js | ruby -r 'rubygems' -r 'closure-compiler' -e "puts Closure::Compiler.new(:compilation_level => 'SIMPLE_OPTIMIZATIONS').compile(STDIN)" > $@

clean:
	rm -f public/javascripts/application.min.js public/stylesheets/application.min.css
