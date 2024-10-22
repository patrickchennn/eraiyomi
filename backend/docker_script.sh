# build default locally
docker build --network=host -t patchn/eraiyomi-server-v1.0.0 .

# build arm+deploy docker hub
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server-v1.0.0 \
    --push .

# build arm,amd+deploy docker hub
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server-v1.0.0 \
    --push .


# run container
docker run --network=host -dit --name eraiyomi-server-v1.0.0 patchn/eraiyomi-server-v1.0.0

# check logs
docker container logs eraiyomi-server-v1.0.0

# docker exec
docker exec -it eraiyomi-server-v1.0.0 sh