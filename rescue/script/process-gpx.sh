#!/bin/bash

set -e
set -o pipefail

TAG=$(echo $GITHUB_REF | sed 's#.*/##')
RELEASE_URL="https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/tags/${TAG}"

curl -k "${RELEASE_URL}" |\
jq -r '.assets[] | "\(.name) \(.id)"' |\
grep -E '^[0-9]{4}' |\
tee /tmp/gpx.list |\
while read name id; do
    curl -kL -o /tmp/$name -H "Accept:application/octet-stream" https://api.github.com/repos/typebrook/ol/releases/assets/$id
done

cat /tmp/gpx.list | cut -d' ' -f1 |\
sed 's#^#-i gpx -f /tmp/#' | xargs echo -n |\
sed 's/^/gpsbabel /; s/$/ -x transform,wpt=trk -x nuketypes,routes,tracks -x position,distance=10 -o gpx -F summary.gpx/' |\
bash

cat summary.gpx
