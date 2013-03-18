
# Compiles a one-file copy of radioactive.js from all the development files.
build: components index.js
	@component build --standalone radioactive --out . --name radioactive

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--require should

# Minifies radioactive.js into a releasable form
min: build
	uglifyjs -o radioactive.min.js radioactive.js

release: clean build test min

.PHONY: clean test min
