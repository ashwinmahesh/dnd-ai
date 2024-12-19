current_dir = $(shell pwd)
project_dir = $(shell realpath $(current_dir)/../)

clean:
	rm -rf $(project_dir)/backend/build

.PHONY: build
build: clean
	mkdir -p $(project_dir)/backend/build
	bazel build //backend/src:dnd_ai_assistant_zip
	cp $(project_dir)/bazel-out/darwin_x86_64-fastbuild/bin/backend/src/dnd_ai_assistant_binary.zip $(project_dir)/backend/build/dnd_ai_assistant.zip

runlocal:
	bazel run //backend/src:dnd_ai_assistant_binary