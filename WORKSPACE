# workspace(name = "dnd_ai")

# load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# # Python rules
# http_archive(
#     name = "rules_python",
#     sha256 = "9acc0944c94adb23fba1c9988b48768b1bacc6583b52a2586895c5b7491e2e31",
#     strip_prefix = "rules_python-0.27.0",
#     url = "https://github.com/bazelbuild/rules_python/releases/download/0.27.0/rules_python-0.27.0.tar.gz",
# )

# load("@rules_python//python:repositories.bzl", "py_repositories")
# py_repositories()

# # # Load the pip_install rule
# # load("@rules_python//python:pip.bzl", "pip_install")

# # # Specify your requirements.txt file
# # pip_install(
# #     requirements = "//backend:requirements.txt",
# # )
# load("@rules_python//python:pip.bzl", "pip_parse")

# pip_parse(
#     name = "pip_deps",
#     requirements_lock = "//backend:requirements.txt",
# )

# load("@pip_deps//:requirements.bzl", "install_deps")

# install_deps()
# load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# # Update the snippet based on the latest release below
# # https://github.com/bazelbuild/rules_python/releases

# http_archive(
#     name = "rules_python",
#     sha256 = "ca77768989a7f311186a29747e3e95c936a41dffac779aff6b443db22290d913",
#     strip_prefix = "rules_python-0.36.0",
#     url = "https://github.com/bazelbuild/rules_python/releases/download/0.36.0/rules_python-0.36.0.tar.gz",
# )

# load("@rules_python//python:repositories.bzl", "py_repositories")

# py_repositories()

# load("@rules_python//python:repositories.bzl", "python_register_toolchains")

# python_register_toolchains(
#     name = "python_3_11",
#     # Available versions are listed in @rules_python//python:versions.bzl.
#     # We recommend using the same version your team is already standardized on.
#     python_version = "3.11",
# )

# load("@rules_python//python:pip.bzl", "pip_parse")

# pip_parse(
#     name = "pypi",
#     python_interpreter_target = "@python_3_11_host//:python",
#     requirements_lock = "//:requirements.txt",
# )


# ATEMPT 3

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_python",
    sha256 = "4f7e2aa1eb9aa722d96498f5ef514f426c1f55161c3c9ae628c857a7128ceb07",
    strip_prefix = "rules_python-1.0.0",
    url = "https://github.com/bazelbuild/rules_python/releases/download/1.0.0/rules_python-1.0.0.tar.gz",
)

load("@rules_python//python:repositories.bzl", "py_repositories")

py_repositories()

load("@rules_python//python:pip.bzl", "pip_parse")

# Create a central repo that knows about the dependencies needed from
# requirements_lock.txt.
pip_parse(
   name = "my_deps",
   requirements_lock = "//backend:requirements_lock.txt",
)
# Load the starlark macro, which will define your dependencies.
load("@my_deps//:requirements.bzl", "install_deps")
# Call it to define repos for your requirements.
install_deps()