#!/bin/bash
set -e

# Configuration
NAMESPACE="concept-car-fy27"
RELEASE_NAME="concept-car-fy27"
CHART_PATH="../helm/concept-car-fy27"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Parse arguments
ACTION="${1:-install}"
IMAGE_TAG="${2:-latest}"

echo "Deploying concept-car-fy27"
echo "Namespace: ${NAMESPACE}"
echo "Release: ${RELEASE_NAME}"
echo "Image Tag: ${IMAGE_TAG}"
echo ""

# Create namespace if it doesn't exist
# kubectl get namespace "$NAMESPACE" &>/dev/null || kubectl create namespace "$NAMESPACE"

case "$ACTION" in
    install)
        echo "Installing Helm chart..."
        helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
            --namespace "$NAMESPACE" \
            --values values.yaml \
            --set image.tag="$IMAGE_TAG" \
            --debug \
            --wait
        ;;
    upgrade)
        echo "Upgrading Helm chart..."
        helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
            --namespace "$NAMESPACE" \
            --values values.yaml \
            --set image.tag="$IMAGE_TAG" \
            --debug \
            --wait
        ;;
    uninstall)
        echo "Uninstalling Helm chart..."
        helm uninstall "$RELEASE_NAME" --namespace "$NAMESPACE" --debug
        ;;
    status)
        echo "Checking deployment status..."
        helm status "$RELEASE_NAME" --namespace "$NAMESPACE"
        echo ""
        kubectl get pods -n "$NAMESPACE" -l "app.kubernetes.io/instance=$RELEASE_NAME"
        ;;
    *)
        echo "Usage: $0 {install|upgrade|uninstall|status} [image-tag]"
        echo ""
        echo "Commands:"
        echo "  install   - Install or upgrade the Helm release"
        echo "  upgrade   - Upgrade an existing release"
        echo "  uninstall - Remove the Helm release"
        echo "  status    - Show release status and pods"
        echo ""
        echo "Examples:"
        echo "  $0 install"
        echo "  $0 install v1.0.0"
        echo "  $0 status"
        exit 1
        ;;
esac

echo ""
echo "Done!"
