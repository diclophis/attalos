# OSX Makefile

build: public/javascripts/application.js public/stylesheets/application.css

public/stylesheets/application.css: src/stylesheets/*.less
	./node_modules/.bin/lessc src/stylesheets/index.less > public/stylesheets/application.css

public/javascripts/application.js: src/javascripts/*.js node_modules/**/*
	./node_modules/.bin/browserify -t reactify src/javascripts/*.js > public/javascripts/application.js

clean:
	touch $(build) && rm -R $(build)
