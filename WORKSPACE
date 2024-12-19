# # # workspace(name = "dnd_ai")

# # # # Load rules_python
# # # load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# # # rules_python_version = "740825b7f74930c62f44af95c9a4c1bd428d2c53"
# # # http_archive(
# # #     name = "rules_python",
# # #     # url = "https://github.com/bazelbuild/rules_python/releases/download/0.40.0/rules_python-0.40.0.tar.gz",
# # #     url = "https://github.com/bazelbuild/rules_python/archive/{}.zip".format(rules_python_version),
# # #     sha256 = "09a3c4791c61b62c2cbc5b2cbea4ccc32487b38c7a2cc8f87a794d7a659cc742",
# # #     # strip_prefix = "rules_python-0.40.0",
# # #     strip_prefix = "rules_python-{}".format(rules_python_version),
# # # )

# # # load("@rules_python//python:pip.bzl", "pip_parse")
# # # pip_parse(
# # #     name = "python_deps",
# # #     requirements_lock = "//backend:requirements_lock.txt",
# # # )
# # # # Load the starlark macro which will define your dependencies.
# # # load("@python_deps//backend:requirements.bzl", "install_deps")
# # # # Call it to define repos for your requirements.
# # # install_deps()

# # workspace(name = "dnd_ai")

# # # Load rules_python
# # load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# # # rules_python_version = "740825b7f74930c62f44af95c9a4c1bd428d2c53"
# # # http_archive(
# # #     name = "rules_python",
# # #     url = "https://github.com/bazelbuild/rules_python/archive/{}.zip".format(rules_python_version),
# # #     sha256 = "09a3c4791c61b62c2cbc5b2cbea4ccc32487b38c7a2cc8f87a794d7a659cc742",
# # #     strip_prefix = "rules_python-{}".format(rules_python_version),
# # # )

# # # Add bazel_skylib
# # http_archive(
# #     name = "bazel_skylib",
# #     urls = ["https://github.com/bazelbuild/bazel-skylib/releases/download/1.3.0/bazel-skylib-1.3.0.tar.gz"],
# #     sha256 = "74d544d96f4a5bb630d465ca8bbcfe231e3594e5aae57e1edbf17a6eb3ca2506",
# #     # strip_prefix = "bazel-skylib-1.3.0",
# # )

# # http_archive(
# #     name = "rules_python",
# #      urls = ["file:///Users/ashwinmahesh/Documents/playground/dnd-ai/backend/rules_python-0.40.0.tar.gz"],
# #     sha256 = "690e0141724abb568267e003c7b6d9a54925df40c275a870a4d934161dc9dd53",
# #     strip_prefix = "rules_python-0.40.0",
# # )

# # # Parse Python dependencies
# # load("@rules_python//python:pip.bzl", "pip_parse")

# # pip_parse(
# #     name = "python_deps",
# #     requirements_lock = "//backend:requirements_lock.txt",
# # )

# workspace(name = "dnd_ai")

# load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# # Python rules
# http_archive(
#     name = "rules_python",
#     sha256 = "9acc0944c94adb23fba1c9bb45f758769e0cb614f707d6fae407ed9fd3af4897",
#     strip_prefix = "rules_python-0.27.0",
#     url = "https://github.com/bazelbuild/rules_python/releases/download/0.27.0/rules_python-0.27.0.tar.gz",
# )

# load("@rules_python//python:repositories.bzl", "py_repositories")
# py_repositories()

# # Root BUILD file
# # BUILD
# load("@rules_python//python:defs.bzl", "py_binary")

# package(default_visibility = ["//visibility:public"])