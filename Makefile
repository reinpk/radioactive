
min:
	cp src/radioactive.js .
	uglifyjs -o radioactive.js radioactive-min.js

release:
	make min

.PHONY: min
