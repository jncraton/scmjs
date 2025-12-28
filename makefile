all: test

lint:
	npx prettier@3.6.2 --check .
	npx jshint@2.13.6

format:
	npx prettier@3.6.2 --write .

test:
	node test.js
