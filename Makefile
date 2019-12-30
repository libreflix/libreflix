env:
	cp .env.sample .env

build:
	docker-compose build

run:
	docker-compose up -d

down:
	docker-compose down

destroy:
	docker-compose down -v

status:
	docker-compose ps

bash:
	docker-compose exec libreflix /bin/bash

logs:
	docker-compose logs -f

tests:
	docker-compose run --rm libreflix npm test
