<p align="center">
  <img src="assets/img/libreflix-logo-24.png" alt="Libreflix Logo" width="300">
</p>

# Libreflix

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D6.1.0-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)

Libreflix is a free, collaborative streaming platform that gathers independent audiovisual productions that are free to watch and thought-provoking.

![Libreflix Interface](https://guilmour.org/img/blog/2018/libreflix-nacionais.jpg)

## About

We advocate for new ways of sharing culture—methods that reach everyone, especially those who cannot afford it. We believe in connecting artists directly with their fans and enabling creators to build upon the work of others. Culture is science, poetry, and it belongs to everyone.

## Access Libreflix

- **Web:** Simply visit [libreflix.org](https://libreflix.org)
- **GNU/Linux:** Coming soon! :)
- **Android:** Download our .apk at [libreflix.org/apps/#android](https://libreflix.org/apps/#android)
- **F-Droid:** Find us on F-Droid: [org.libreflix.app](https://f-droid.org/en/packages/org.libreflix.app/)
- **Windows:** Download the installer at [libreflix.org/apps/#windows](https://libreflix.org/apps/#windows)

## Technology Stack

Libreflix is built with a modern and flexible stack:

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Templating:** Nunjucks
- **Search:** Elasticsearch
- **Validation:** Express-Validator
- **Authentication:** Passport.js

## Development

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Alternatively, Node.js (>= 6.1.0) and MongoDB

### Quick Start (Using Docker)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/libreflix/libreflix.git
   cd libreflix
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.sample .env
   ```

3. **Build and run the containers:**
   ```bash
   make up
   ```

The application will be available at [http://localhost:3998](http://localhost:3998).

### Database Migrations

Manage database changes using our custom migration system:

*   **Run all pending migrations:**
    ```bash
    make db-migration
    ```
*   **Run a specific migration up:**
    ```bash
    make db-migration-up id=<timestamp>
    ```
*   **Run a specific migration down:**
    ```bash
    make db-migration-down id=<timestamp>
    ```

## How to Help

There are many ways to contribute to Libreflix:

- **Code:** Contribute to our source code here on GitHub.
- **Funding:** Support our crowdfunding campaign at [catarse.me/libreflix](https://catarse.me/libreflix).
- **Moderation:** Get in touch to become a content moderator.
- **Spread the Word:** Share, download, and tell your friends about the platform!

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See the [LICENSE.md](LICENSE.md) file for details.

Copyright by [Guilmour Rossi and contributors](https://github.com/libreflix/libreflix/graphs/contributors).

---

If you encounter any problems, feel free to open an [issue](https://github.com/libreflix/libreflix/issues/new).

