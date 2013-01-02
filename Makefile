
min: analytics.js
	cp src/nuclear-decay.js .
	uglifyjs -o nuclear-decay.js nuclear-decay-min.js

release:
	make min

.PHONY: min
