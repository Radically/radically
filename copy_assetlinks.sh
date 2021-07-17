# this script copies a b64-encoded assetlinks.json to public/.well-known/assetlinks.json

if [[ -z "${ASSET_LINKS_BASE64}" ]]; then
    echo "ASSET_LINKS_BASE64 is not defined. Terminating."
else
    mkdir -p ./public/.well-known/
    echo $ASSET_LINKS_BASE64 | base64 --decode > ./public/.well-known/assetlinks.json
fi