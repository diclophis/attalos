# Makefile see: https://www.gnu.org/prep/standards/html_node/Standard-Targets.html

TARGET_MODULE=Attalos

src_less = ./src/stylesheets/index.less
javascript_src = ./src/javascripts
javascripts_jsx = $(shell find $(javascript_src) -type f -name "*.js")
javascripts_jsx_dir = $(shell find $(javascript_src) -type d)
javascripts = $(patsubst $(javascript_src)/%,build/%, $(javascripts_jsx))
javascripts_dir = $(patsubst $(javascript_src)%,build%, $(javascripts_jsx_dir))
public_dirs = ./public ./public/javascripts ./public/stylesheets
output_dirs = $(public_dirs) $(javascripts_dir)
node_modules = ./build/npm-install.log

debug_js = ./public/javascripts/application.js
debug_css = ./public/stylesheets/application.css
dist_js = ./public/javascripts/application.min.js
dist_css = ./public/stylesheets/application.min.css
dev_html = ./public/dev.html
dist_html = ./public/index.html

.PHONY: all check clean dist-clean

env: $(node_modules)
	nslookup attalos.app.dev.mavenlink.net
	echo '<?xml version="1.0"?>  <stream:stream to="foo.com" xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" version="1.0">' | nc attalos.app.dev.mavenlink.net 5100
	env

dev: $(output_dirs) $(dev_html)
	echo '<?xml version="1.0"?>  <stream:stream to="foo.com" xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" version="1.0">' | nc attalos.app.dev.mavenlink.net 5100
	nslookup attalos.app.dev.mavenlink.net

dist: $(output_dirs) $(dist_html)

debug:
	echo $(javascripts_jsx_dir)
	echo $(javascripts_dir)
	echo $(javascripts)
	echo $(javascripts_jsx)

all: dev check dist

check: $(javascripts)
	./bin/test

clean:
	rm -Rf $(output_dirs)

dist-clean: clean
	rm -Rf node_modules $(node_modules)

$(node_modules): package.json
	NPM_CONFIG_OPTIONAL=false npm install 2>&1 | tee -a $(node_modules)

public/stylesheets/application.min.css: $(debug_css)
	./bin/stylesheet_compress $< > $@

$(debug_css): src/stylesheets/*.less
	./bin/stylesheet_compile $(src_less) > $@

public/dev.html: $(node_modules) $(javascripts) $(debug_js) $(debug_css)
	./bin/render_html $(debug_js) $(debug_css) $(TARGET_MODULE) > $@

public/index.html: $(node_modules) $(javascripts) $(dist_js) $(dist_css)
	./bin/render_html $(dist_js) $(dist_css) $(TARGET_MODULE) > $@

$(output_dirs):
	mkdir -p $@

build/%: src/javascripts/%
	./bin/javascript_compile $< > $@

$(debug_js): $(javascripts)
	./bin/javascript_package $(TARGET_MODULE) build/index.js $@

$(dist_js): $(debug_js)
	./bin/javascript_compress $(TARGET_MODULE) $< $@

docker:
	vagrant up
	ansible-playbook -i ansible/attalos.inventory ansible/attalos-playbook.yml
