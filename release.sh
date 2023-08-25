#!/usr/bin/env bash
#
# This script creates a new release and is therefore not meant to be
# used by anyone but the project manager. It will therefore remain
# undocumented and may assume some specific environment.

abort_release()
{
	echo "Aborting."
	exit 1
}

display_app_version()
{
	local app_version

	app_version="$(jq --raw-output '.version' 'package.json')"
	echo "Current version for app ${app_name}: ${app_version}"
}

update_app_version()
{
	local new_version="$1"
	local tmp_file="package.json.tmp"
	local current_date=$(date "+%Y-%m-%d")

	jq ".version = \"${new_version}\"" "package.json" >"${tmp_file}"
	mv "${tmp_file}" "package.json"
	sed -i "s/## \[Unreleased\]/## \[${new_version}\] - ${current_date}/" "CHANGELOG.md"
}

check_working_directory()
{
	local status

	status=$(git status --untracked-files="no" --porcelain="2")
	if [[ "$status" != "" ]]; then
		echo "Unable to create a new release while the working directory is not clean."
		abort_release
	fi
}

build_assets()
{
	local new_version="$1"
	local asset_dir="sake-app_v${new_version}"

	npm run --silent build >/dev/null
	cp -r "dist" "${asset_dir}"
	cp "LICENSE-APACHE-2.0.txt" "${asset_dir}"
	cp "LICENSE-MIT.txt" "${asset_dir}"
	rm -f "${asset_dir}/manifest.webmanifest" "${asset_dir}/sw.js"

	tar czf "${asset_dir}.tar.gz" "${asset_dir}"
	zip -q -r "${asset_dir}.zip" "${asset_dir}"

	rm -rf "${asset_dir}"

	echo
	echo "Assets created:"
	echo " - ${asset_dir}.tar.gz"
	echo " - ${asset_dir}.zip"
}

commit_new_version()
{
	local new_version="$1"

	git add --update
	git commit -m "SAKE-app v${new_version}"
	git tag -a "v${new_version}" -m "SAKE-app v${new_version}"

	echo
	echo "Version ${new_version} has been committed and tagged."
	echo "If everything is correct, you can publish if using:"
	echo "  git push"
	echo "  git push origin v${new_version}"
}

release_new_version()
{
	local new_version="$1"
	local confirm_git_diff

	update_app_version "${new_version}"

	git diff

	echo
	echo -n "Does everything seems ok? [y|N] "
	read -r confirm_git_diff

	case "${confirm_git_diff}" in
		y|Y) commit_new_version "${new_version}"
			build_assets "${new_version}";;
		*)
			git restore "."
			abort_release
			;;
	esac
}

main()
{
	local new_version
	local confirm_release

	check_working_directory

	display_app_version

	echo
	echo -n "Enter the new version: "
	read -r new_version

	export LC_TIME="en_US.UTF-8"
	current_date=$(date "+%b %d, %Y")

	echo
	echo "You are about to release version ${new_version} on ${current_date}"
	echo -n "Are you sure? [y/N] "
	read -r confirm_release

	case "${confirm_release}" in
		y|Y) release_new_version "${new_version}";;
		*) abort_release;;
	esac
}

main
