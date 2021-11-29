#!/bin/sh

set -eu;

script_dir=$(dirname "${0}");

# Create required directories if they don't exist
mkdir -p "${script_dir}/../public/css/summary";
mkdir -p "${script_dir}/../public/js/summary";
mkdir -p "${script_dir}/../public/img/summary";

# Copy files to public directory for static serving
cp -r "${script_dir}/static/css/"* "${script_dir}/../public/css/summary";
cp -r "${script_dir}/static/js/"* "${script_dir}/../public/js/summary";
cp -r "${script_dir}/static/img/"* "${script_dir}/../public/img/summary";

# Build site
asciidoctor "${script_dir}/index.adoc" -a webfonts! -o "${script_dir}/../public/html/summary.html";

# Lazy load images
sed -i -e 's/<img/<img loading="lazy"/g' "${script_dir}/../public/html/summary.html";

echo "Summary site build complete";
