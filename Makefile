IMAGE_NAME := $(shell node -p "require('./package.json').name")
VERSION := $(shell node -p "require('./package.json').version")
NPM_TOKEN := ${NPM_TOKEN}

.phony: recreate
build:
	docker build --no-cache --progress=plain --build-arg NPM_TOKEN=$(NPM_TOKEN) --tag "$(IMAGE_NAME):$(VERSION)" .
	docker tag $(IMAGE_NAME):$(VERSION) ${DOCKERHUB_USERNAME}/$(IMAGE_NAME):$(VERSION)
	docker push ${DOCKERHUB_USERNAME}/$(IMAGE_NAME):$(VERSION)
	docker tag $(IMAGE_NAME):$(VERSION) ${DOCKERHUB_USERNAME}/$(IMAGE_NAME):latest
	docker push ${DOCKERHUB_USERNAME}/$(IMAGE_NAME):latest
recreate:
	docker-compose up -d --force-recreate --no-deps $(IMAGE_NAME)
version:
	@echo -n $(VERSION)
