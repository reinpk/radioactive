
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = -s web-security=false -s local-to-remote-url-access=true

# Compiles a one-file copy of analytics.js from all the development files.
radioactive.js: install
	component build --standalone radioactive --out . --name radioactive

install:
	component install

component:
	component build --out . --name radioactive.component --dev

# Minifies radioactive.js into a releasable form
min: radioactive.js
	uglifyjs -o radioactive.min.js radioactive.js

# Starts the testing server.
server:
	node test/server.js &

# Kills the testing server.
kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt

# Runs all the tests on travis.
test: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	make kill

# Minifies and tests the library
release:
	make min
	make test

.PHONY: min
