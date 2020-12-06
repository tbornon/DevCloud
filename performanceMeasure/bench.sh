#!/bin/bash

echo "Starting the benchmarking for all requests"

# Remove existing bench results
rm -rd benchResults
# Make new folder for bench results
mkdir benchResults

# For each file in requests folder
for f in requests/*.js
do
	# Keep only filename
	filename="${f#requests/}"
	# Display it
	echo $filename

	# Repeat the request 10 times
	for i in {1..10}; do
		# Do the request
		# => remove the first line because it contains "switch to modelX"
		# => keep only executionTimeMillis line(s)
		# => it might be multiple lines so keep only the first one
		# => extract the digits 
		# => put extracted data in file for later exploitation
		mongo --host devicimongodb017 --port 30000 --quiet < $f | sed 1d | grep "\"executionTimeMillis\"" | head -n 1 | grep -o '[0-9]\+' >> benchResults/$filename
	done
done
