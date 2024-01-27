env:
	cp .env.sample .env

configure-nodejs:    
	curl -sL https://deb.nodesource.com/setup_10.x | bash -
	apt-get update
	apt-get install -y nodejs=10.19.0-1nodesource1
	rm -rf /var/lib/apt/lists/*

docker-build:
	docker-compose build

docker-run:
	docker-compose up -d

docker-down:
	docker-compose down

docker-destroy:
	docker-compose down -v

docker-status:
	docker-compose ps

docker-bash:
	docker-compose exec libreflix /bin/bash

docker-logs:
	docker-compose logs -f

docker-test:
	docker-compose run --rm libreflix npm test

npm-build:
	npm install . 
	npm install express@4.13.4
	npm install -g nodemon@2.0.1
	npm audit fix --force
	npm install elasticsearch@16.5.0 --save
	npm install jest --global@24.9.0

npm-test:
	npm test

bash:
	docker compose exec libreflix bash

up:
	docker compose up

build:
	docker compose up

serve:
	nodemon -e js,html,css,md,json server.js
