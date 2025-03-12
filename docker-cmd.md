
## Server side

### build locally with root context
docker build --network=host -t patchn/eraiyomi-server-v2.0.0 -f backend/Dockerfile .

### run container locally
docker run --network=host -dit --name eraiyomi-server-v2.0.0 patchn/eraiyomi-server-v2.0.0

### build arm+deploy docker hub
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-server:2.0.0 \
    -f backend/Dockerfile \
    --push .

## Staging server
### build locally
docker build --network=host -t patchn/eraiyomi-staging-server:latest -f backend/Dockerfile.staging .
docker build --no-cache --network=host -t patchn/eraiyomi-staging-client:latest -f frontend/Dockerfile.staging .

### run container locally

docker run --env-file backend/.env --network=host -d --name eraiyomi-staging-server patchn/eraiyomi-staging-server

### build arm+deploy docker hub
docker buildx build --platform linux/arm64 --network=host -t patchn/eraiyomi-staging-server:latest -f backend/Dockerfile.staging --push .

### etc
docker container rm eraiyomi-staging-server

docker container logs eraiyomi-staging-server

docker pull eraiyomi-staging-server:latest

docker run --network=host -d --name eraiyomi-staging-server patchn/eraiyomi-staging-server


### docker pull
docker pull patchn/eraiyomi-server:2.0.0

### docker run PI
docker run --restart=unless-stopped	--network=host -dit --name eraiyomi-server-v2.0.0 patchn/eraiyomi-server:2.0.0

## Client side

### build locally with root context
docker build --network=host -t patchn/eraiyomi-client-v2.0.0 -f frontend/Dockerfile .

### run container locally
docker run --network=host -dit --name eraiyomi-client-v2.0.0 patchn/eraiyomi-client-v2.0.0

### build arm+deploy docker hub w/ root context
docker buildx build \
    --platform linux/arm64 \
    --network=host \
    -t patchn/eraiyomi-client:2.0.0 \
    -f frontend/Dockerfile \
    --push .

### docker pull
docker pull patchn/eraiyomi-client:2.0.0

### docker run PI
docker run --restart=unless-stopped	--network=host -dit --name eraiyomi-client-v2.0.0 patchn/eraiyomi-client:2.0.0