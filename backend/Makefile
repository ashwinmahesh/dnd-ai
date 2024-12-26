current_dir = $(CURDIR)
project_dir = $(current_dir)/..

clean:
	rm -rf $(project_dir)/backend/build

compile-deps:
	pip-compile --output-file=requirements_lock.txt requirements.txt

build: clean compile-deps
	mkdir -p $(project_dir)/backend/build
	bazel build //backend/src:dnd_ai_assistant_zip
	cp $(project_dir)/bazel-bin/backend/src/dnd_ai_assistant_binary.zip $(project_dir)/backend/build/dnd_ai_assistant.zip

runlocal:
	@FIREBASE_CREDS="$$(cat firebase_creds.json)" \
	env $$(cat .env | xargs) \
	bazel run //backend/src:dnd_ai_assistant_binary

.PHONY: build-docker
build-docker: build
	docker build -t dnd-ai:latest .
	docker tag dnd-ai:latest ashwinmahesh1/dnd-ai:$(shell git rev-parse HEAD)
	docker tag dnd-ai:latest ashwinmahesh1/dnd-ai:latest

run-docker:
	docker run --platform linux/amd64 -p 6875:6875 --pull=always --env-file .env ashwinmahesh1/dnd-ai:latest

push-docker:
	docker push ashwinmahesh1/dnd-ai:$(shell git rev-parse HEAD)
	docker push ashwinmahesh1/dnd-ai:latest
