all: test

lint:
	npx prettier@3.6.2 --check .
	npx jshint@2.13.6

format:
	npx prettier@3.6.2 --write .

test:
	node test.js

scheme.min.js: scheme.js
	npx uglify-js@3.19.3 --compress --mangle eval -- $< > $@
	wc -c $@

clean:
	rm -f scheme.min.js
