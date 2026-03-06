#!/bin/bash
set -e

# Configuration
IMAGE_REPO="us-docker.pkg.dev/stage-23704/us.gcr.io/concept-car-fy27"
TAG="${1:-latest}"
PLATFORMS="linux/amd64,linux/arm64"

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Building Docker image (multi-arch)..."
echo "Repository: ${IMAGE_REPO}"
echo "Tag: ${TAG}"
echo "Platforms: ${PLATFORMS}"
echo ""

cd "$PROJECT_ROOT"

# Ensure buildx builder exists
BUILDER_NAME="colima"
if ! docker buildx inspect "$BUILDER_NAME" &>/dev/null; then
    echo "Creating buildx builder: ${BUILDER_NAME}"
    docker buildx create --name "$BUILDER_NAME" --use --bootstrap
else
    docker buildx use "$BUILDER_NAME"
fi

# Build and push multi-arch image
echo ""
read -p "Build and push to registry? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Building and pushing multi-arch image..."

    # Build with multiple tags if version specified
    if [ "$TAG" != "latest" ]; then
        docker buildx build \
            --platform "$PLATFORMS" \
            --tag "${IMAGE_REPO}:${TAG}" \
            --tag "${IMAGE_REPO}:latest" \
            --push \
            .
    else
        docker buildx build \
            --platform "$PLATFORMS" \
            --tag "${IMAGE_REPO}:${TAG}" \
            --push \
            .
    fi

    echo ""
    echo "Multi-arch image pushed successfully!"
    echo "Platforms: ${PLATFORMS}"
else
    # Build locally (single platform, no push)
    echo "Building for local platform only..."
    docker buildx build \
        --tag "${IMAGE_REPO}:${TAG}" \
        --load \
        .
    echo ""
    echo "Local image built: ${IMAGE_REPO}:${TAG}"
fi
