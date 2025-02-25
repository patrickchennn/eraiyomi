# build arm+deploy docker hub
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:2.0.0 \
    --push .

# build arm+deploy docker hub: context from root
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:2.0.0 \
    --push \
    -f ./frontend/Dockerfile .

# build arm,amd+deploy docker hub
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:2.0.0 \
    --push .

# docker pull
docker pull patchn/eraiyomi-client:2.0.0