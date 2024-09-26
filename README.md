![Logo da libreflix](assets/img/libreflix-logo-24.png)
-----
## Sobre

Libreflix é uma plataforma de streaming livre e colaborativa que reúne produções audiovisuais independentes, de livre exibição e que fazem pensar.


![](https://guilmour.org/img/blog/2018/libreflix-nacionais.jpg)

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
0. First, clone the repository.
``` bash
cd libreflix
```

1. Copy environment file
``` bash
cp .env.sample .env
```

2. Finally, use make commands to build and up the containers:
``` bash
make up
```
3. In another shell, you'll need to enter the `libreflix` container:
``` bash
make bash
```

4. Install the dependencies in the `libreflix` container:
```bash
npm install
```

```
5. Initiate the node server inside the container:
``` bash
make serve
```

Ready! If everything is working fine, just access on your browser [http://localhost:3998](http://localhost:3998).
If you have any problem, feel free to open an [issue](https://github.com/libreflix/libreflix/issues/new).

