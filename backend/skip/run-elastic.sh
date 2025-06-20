#!/usr/bin/env bash

# .env 파일 불러오기
set -a
source .env
set +a

# 도커 컴포즈 실행
docker-compose up -d