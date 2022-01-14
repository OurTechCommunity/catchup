#!/bin/bash

set -eu;

script_dir=$(dirname "${0}");

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
		IFS="/";
		read -ra arr <<< "${path}";

		arr_length=${#arr[@]};
		catchup_number=${arr[arr_length-1]};

		if [ ${catchup_number:0:2} == "00" ]; then
			catchup_display_number=${catchup_number:2:1};
		elif [ ${catchup_number:0:1} == "0" ]; then
			catchup_display_number=${catchup_number:1:2};
		else
			catchup_display_number=catchup_number;
		fi;

		asciidoctor "${script_dir}/../summary/individual-summary.adoc" -a webfonts! -o "${script_dir}/../public/html/summary/${catchup_number}.html" -a catchup_number=${catchup_number} -a catchup_display_number=${catchup_display_number};

		sed -i -e "s/<img/<img loading=\"lazy\"/g" "${script_dir}/../public/html/summary/${catchup_number}.html"; # Lazy load images

		sed -i -e "s/property=\"og:title\" content=\"OTC CatchUp/property=\"og:title\" content=\"OTC CatchUp #${catchup_display_number}/g" "${script_dir}/../public/html/summary/${catchup_number}.html"; # Add CatchUp number to OG Title Tag

		sed -i -e "s/property=\"og:url\" content=\"https:\/\/catchup.ourtech.community\/summary\"/property=\"og:url\" content=\"https:\/\/catchup.ourtech.community\/summary\/${catchup_display_number}\"/g" "${script_dir}/../public/html/summary/${catchup_number}.html"; # Add CatchUp number to OG URL Tag

		unset IFS;
	fi;
done;

echo "Asciidoctor Jet summary site build complete.";
