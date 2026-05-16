.PHONY: build dev test clean

build:
	wasm-pack build --target web --out-dir www/pkg --release

dev: build
	cd www && python3 -m http.server 8000

test:
	cargo test

clean:
	cargo clean
	rm -rf www/pkg
