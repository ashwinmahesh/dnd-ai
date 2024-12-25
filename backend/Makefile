current_dir = $(shell pwd)
project_dir = $(shell realpath $(current_dir)/../)

# bazel build --platforms=//backend:macos //backend/src:dnd_ai_assistant_zip

clean:
	rm -rf $(project_dir)/backend/build

compile-deps:
	pip-compile --output-file=requirements_lock.txt requirements.txt

build: clean # compile-deps
	mkdir -p $(project_dir)/backend/build
	bazel build //backend/src:dnd_ai_assistant_zip
	cp $(project_dir)/bazel-bin/backend/src/dnd_ai_assistant_binary.zip $(project_dir)/backend/build/dnd_ai_assistant.zip

runlocal:
	@env $$(cat .env | xargs) \
	bazel run //backend/src:dnd_ai_assistant_binary

.PHONY: build-docker
build-docker: build
	docker build --platform=linux/arm64 -t dnd-ai:latest .
	docker tag dnd-ai:latest ashwinmahesh1/dnd-ai:$(shell git rev-parse HEAD)

run-docker:
	docker run --pull=never --env-file .env dnd-ai

push-docker:
	docker push ashwinmahesh1/dnd-ai:$(shell git rev-parse HEAD)
