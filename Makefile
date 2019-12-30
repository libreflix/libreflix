env:
	cp .env.sample .env

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
	npm install express
	npm install -g nodemon
	npm audit fix --force
	npm install elasticsearch --save
	npm install jest --global

npm-test:
	npm test
