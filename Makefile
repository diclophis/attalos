# Makefile see: https://www.gnu.org/prep/standards/html_node/Standard-Targets.html

TARGET_MODULE=Attalos
TARGET_HOST=attalos.bardin.haus

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

#NOTE: override these at execution time
REPO ?= localhost/
IMAGE_NAME ?= naked
IMAGE_TAG ?= $(strip $(shell find Dockerfile.attalos Gemfile Gemfile.lock *.js public/**/* public/* -type f | xargs shasum | sort | shasum | cut -f1 -d" "))
IMAGE = $(REPO)$(IMAGE_NAME):$(IMAGE_TAG)

BUILD=build

$(shell mkdir -p $(BUILD))
MANIFEST_TMP=$(BUILD)/deployment.yml

.INTERMEDIATE: $(MANIFEST_TMP)
.PHONY: image uninstall clean
.PHONY: all check clean dist-clean

all: dev check dist $(BUILD)/$(IMAGE_TAG) install

env: $(node_modules)
	nslookup $(TARGET_HOST)
	#echo '<?xml version="1.0"?>  <stream:stream to="foo.com" xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" version="1.0">' | nc $(TARGET_HOST) 5100
	env

dev: $(output_dirs) $(dev_html)
	#echo '<?xml version="1.0"?>  <stream:stream to="foo.com" xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" version="1.0">' | nc $(TARGET_HOST) 5100
	nslookup $(TARGET_HOST)

dist: $(output_dirs) $(dist_html)

debug:
	echo $(javascripts_jsx_dir)
	echo $(javascripts_dir)
	echo $(javascripts)
	echo $(javascripts_jsx)

check: $(javascripts)
	true #./bin/test

dist-clean: clean
	rm -Rf node_modules $(node_modules)

$(node_modules): package.json $(output_dirs)
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

#docker:
#	vagrant up
#	ansible-playbook -i ansible/attalos.inventory ansible/attalos-playbook.yml
# Makefile for besoked installation

image:
	docker build -f Dockerfile.attalos -t $(IMAGE) .
	echo built $(IMAGE)

$(BUILD)/$(IMAGE_TAG): image
	touch $(BUILD)/$(IMAGE_TAG)

install: $(MANIFEST_TMP)
	cat $(MANIFEST_TMP)
	kubectl apply -f $(MANIFEST_TMP)

$(MANIFEST_TMP): manifest.rb kubernetes/deployment.yml $(BUILD)/$(IMAGE_TAG)
	ruby manifest.rb "$(REPO)" $(IMAGE_NAME) $(IMAGE_TAG) > $(MANIFEST_TMP)

uninstall:
	kubectl delete -f $(MANIFEST_TMP) || true

clean: uninstall
	rm -Rf $(output_dirs)
	rm -Rf $(BUILD)
