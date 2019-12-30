![Logo da libreflix](assets/img/libreflix.png)

[![Build Status](https://ci.ayrlabs.org/api/badges/librefix/libreflix/status.svg)](https://ci.ayrlabs.org/libreflix/libreflix)
-----
[![Build Status](https://ci.ayrlabs.org/api/badges/libreflix/libreflix/status.svg)](https://ci.ayrlabs.org/libreflix/libreflix)
## Sobre

Libreflix é uma plataforma de streaming livre e colaborativa que reúne produções audiovisuais independentes, de livre exibição e que fazem pensar.


![](https://s3-sa-east-1.amazonaws.com/cdn.br.catarse/uploads/redactor_rails/picture/data/244309/screely-1569280205294.png)



Nós defendemos novas formas de compartilhamento da cultura. Formas que atinjam todas as pessoas, principalmente as que não podem pagar por ela. Formas que conectem os artistas direto com os fãs. E até formas que permitam que artistas criem algo novo à partir do trabalho de outros artistas. Cultura é ciência, é poesia e é de todo mundo.

## Acessar
- **Na web:** Você só precisa acessar o endereço https://libreflix.org
- **GNU/Linux:** Em breve :)
- **Android:** Baixe o nosso .apk disponível em https://libreflix.org/apps/#android
- **F-Droid:** Procure o app dentro do F-droid: https://f-droid.org/en/packages/org.libreflix.app/
- **Windows:** Baixe o programa instalável disponível em https://libreflix.org/apps/#windows

## Jeitos de ajudar
- Contribua com o código-fonte do programa
- Ajuda na nossa campanha de financiamento coletivo https://catarse.me/libreflix
- Entre em contato para ser um moderador de conteúdo
- Divulgue, compartilhe, baixe e mostra para os amigos sobre a paltaforma

## Desenvolvimento
**Deploying (Using Docker)**
First, clone the repository.
``` bash
git clone https://libregit.org/libreflix/libreflix
cd libreflix
```

Generate environment file:
``` bash
make env
```

Finally, use Docker to deploy:
``` bash
make run
```

Pronto! Now access on your browser [http://localhost:3998](http://localhost:3998)

To run unit tests and check code coverage:
``` bash
make tests
```

Checking Docker containers status:
``` bash
make status
```

To view logs in real time:
``` bash
make logs
```

Stopping all containers:
``` bash
make down
```

Destroy all data:
``` bash
make destroy
```

# Apoio

<a href="http://pesquisa.ufabc.edu.br/lablivre/sobre/" target="_blank"><img src="https://libregit.org/libreflix/libreflix/raw/branch/master/public/assets/friends/lablivre-logo.png" alt="LabLivre" width="200"></a>
