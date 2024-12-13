#!/bin/bash

echo "Building Docker images for all services..."

docker build --no-cache -t order-service:latest ./order-service
docker build --no-cache -t inventory-service:latest ./inventory-service
docker build --no-cache -t user-service:latest ./user-service
docker build --no-cache -t api-gateway:latest ./api-gateway

