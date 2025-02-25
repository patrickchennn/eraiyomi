# build default locally
docker build --network=host -t patchn/eraiyomi-server-v2.0.0 .

# run container locally
docker run --network=host -dit --name eraiyomi-server-v2.0.0 patchn/eraiyomi-server-v2.0.0

# build arm+deploy docker hub
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server:2.0.0 \
    --push .

# build arm+deploy docker hub: context from root
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server:2.0.0 \
    --push \
    -f ./backend/Dockerfile .

# build arm,amd+deploy docker hub
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server:2.0.0 \
    --push .

# docker pull
docker pull patchn/eraiyomi-server:2.0.0