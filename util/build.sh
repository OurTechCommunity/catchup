#!/bin/bash

set -eu;

script_dir=$(dirname "${0}");

echo "Building summary pages using Asciidoctor Jet...";

# Create required directories if they don't exist
mkdir -p "${script_dir}/../public/css/summary";
mkdir -p "${script_dir}/../public/html/summary";
mkdir -p "${script_dir}/../public/js/summary";
mkdir -p "${script_dir}/../public/img/summary";

# Remove all summary files to prevent residual files
rm -rf "${script_dir}/../public/css/summary/"*;
rm -rf "${script_dir}/../public/html/summary/"*;
rm -rf "${script_dir}/../public/js/summary/"*;
rm -rf "${script_dir}/../public/img/summary/"*;

# Copy files to public directory for static serving
cp -r "${script_dir}/../summary/static/css/"* "${script_dir}/../public/css/summary";
cp -r "${script_dir}/../summary/static/js/"* "${script_dir}/../public/js/summary";
cp -r "${script_dir}/../summary/static/img/"* "${script_dir}/../public/img/summary";

# Build combined summary site
asciidoctor "${script_dir}/../summary/combined-summary.adoc" -a webfonts! -o "${script_dir}/../public/html/summary/combined-summary.html";
sed -i -e 's/<img/<img loading="lazy"/g' "${script_dir}/../public/html/summary/combined-summary.html"; # Lazy load images

# Build individual summary pages
for path in "${script_dir}/../summary/sessions/"*; do
	if [ -d "${path}" ]; then
		catchup_number=${path##*/};
		printf -v "catchup_display_number" "%.0f" "${catchup_number}";

		asciidoctor "${script_dir}/../summary/individual-summary.adoc" -a webfonts! -o "${script_dir}/../public/html/summary/${catchup_number}.html" -a catchup_number=${catchup_number} -a catchup_display_number=${catchup_display_number};

		sed -i -e "s/<img/<img loading=\"lazy\"/g" "${script_dir}/../public/html/summary/${catchup_number}.html"; # Lazy load images
	fi;
done;

echo -e "Summary pages build complete!\n";
