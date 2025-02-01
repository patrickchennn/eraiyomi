# build default locally
docker build --network=host -t patchn/eraiyomi-client-v1.0.0 .

# run container locally
docker run --network=host -dit --name eraiyomi-client-v1.0.0 patchn/eraiyomi-client-v1.0.0

# build arm+deploy docker hub
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:1.0.0 \
    --push .

# build arm,amd+deploy docker hub
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:1.0.0 \
    --push .

# check logs
docker container logs eraiyomi-client-v1.0.0

# docker exec
docker exec -it eraiyomi-client-v1.0.0 sh

# docker pull
docker pull patchn/eraiyomi-client:1.0.0

# docker run PI
docker run --restart=unless-stopped	--network=host -dit --name eraiyomi-client-v1.0.0 patchn/eraiyomi-client:1.0.0