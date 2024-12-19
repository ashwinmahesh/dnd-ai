current_dir = $(shell pwd)
project_dir = $(shell realpath $(current_dir)/../)

clean:
	rm -rf $(project_dir)/backend/build

compile-deps:
	pip-compile --output-file=requirements_lock.txt requirements.txt

build: clean compile-deps
	mkdir -p $(project_dir)/backend/build
	bazel build //backend/src:dnd_ai_assistant_zip
	cp $(project_dir)/bazel-out/darwin_x86_64-fastbuild/bin/backend/src/dnd_ai_assistant_binary.zip $(project_dir)/backend/build/dnd_ai_assistant.zip

runlocal:
	@env $$(cat .env | xargs) \
	bazel run //backend/src:dnd_ai_assistant_binary

build-docker: build
	docker build --platform linux/arm64 -t dnd-ai .

run-docker:
	docker run --pull=never --platform linux/arm64 dnd-ai

