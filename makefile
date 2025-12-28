all: 	hashshare.js

hashshare.js:
	wget https://github.com/jncraton/hashshare/releases/download/v3.0.0/hashshare.js
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
	rm -f scheme.min.js hashshare.js
