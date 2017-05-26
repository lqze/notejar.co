#!/bin/bash
# This script is for pushing changes to your remote www directory.
# Author: Caleb Fetzer, 2017

# Check for _script folder in current directory.
if [ ! -d "_site" ]; then
	echo "WARNING: Missing  _site  directory. Check your current working path!";
	echo "Now exiting..."
	exit;
fi

echo
echo "Do you want to build your site first (jekyll build)?"
echo "WARNING: Recommended if you had made changes to your site!"
while true; do
	read -p "y/n?" yn
	case $yn in
		[Yy]* ) echo "Building..."; jekyll build; break;;
		[Nn]* ) echo "Skipping build."; break;;
	esac
done

echo
echo "This will push all changes in _site to your remote VPS directory."
echo ""
echo "-------------------- Do you wish to proceed? --------------------"
while true; do
	read -p "y/n?" yn
	case $yn in
		# This currently pushes to my directory.
		[Yy]* ) echo "Pushing changes..."; rsync -av _site/ ezql@notejar.co:/srv/www/notejar.co; echo "Successfully pushed."; break;;
		[Nn]* ) echo "\nYou chose not to push. Bye!"; exit;;
	esac
done
