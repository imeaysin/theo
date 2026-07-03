#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME=mongodb

if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
  status="$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME")"
  if [ "$status" != "running" ]; then
    echo "Starting existing $CONTAINER_NAME container..."
    docker start "$CONTAINER_NAME"
  fi
  exit 0
fi

docker compose up -d
