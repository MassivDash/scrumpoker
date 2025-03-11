<h1 align="center">Scrum Poker - Real-Time Agile Estimation Tool</h1>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.2-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/MassivDash/astrox" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/SpaceoutPl" target="_blank">
    <img alt="Twitter: SpaceoutPl" src="https://img.shields.io/twitter/follow/SpaceoutPl.svg?style=social" />
  </a>
</p>

![CodeQL](https://github.com/MassivDash/ado-npmrc-ts-action/actions/workflows/codeql-analysis.yml/badge.svg)![CI](https://github.com/MassivDash/astrox/actions/workflows/ci.yml/badge.svg)![Compliation](https://github.com/MassivDash/astrox/actions/workflows/release.yml/badge.svg)!

**Platforms**

![windows](https://img.shields.io/badge/Platform-Windows-blue)
![linux](https://img.shields.io/badge/Platform-Linux-blue)
![macOs](https://img.shields.io/badge/Platform-MacOs-blue)

## Overview

Scrum Poker is a real-time, WebSocket-powered estimation tool for Agile teams. Built on the AstroX template, it combines the power of Rust's Actix framework with Astro's frontend capabilities to deliver a seamless, interactive planning poker experience.

demo at scrum-poker.spaceout.pl

## Features

- Create custom estimation rooms
- Invite team members via simple links
- Real-time updates using WebSocket technology
- Unlimited estimation questions per room
- Ad-free and open-source
- Cross-device compatibility

## Getting Started

To start developing with Scrum Poker, you'll need:

- Rust (rustc > 1.74)
- Node.js (> 18.14)

Clone the project and run:

```
cargo run
```

The interactive CLI will guide you through the installation process.

## CLI Features

The Scrum Poker CLI inherits all the powerful features from AstroX, including:

- Interactive mode
- Git hooks integration
- Build and serve commands
- Testing and linting
- System checks

For a full list of CLI commands and arguments, refer to the original AstroX README.

## WebSocket Example

The Scrum Poker application serves as the WebSocket example for astro_x project https://github.com/MassivDash/astroX. It demonstrates real-time communication between clients and the server, enabling instant updates during estimation sessions.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/massivdash/scrum-poker/issues).

## License

This project is [MIT](LICENSE) licensed.

### CLI

Rust written command line interface starts, serves and tests the astro x project. Fast and efficient with only few dependencies will create a professional development environment for rust opinionated project.

#### Cli Project Runner

Handles installation and system checks, it will check the astroX system prerequisites and either help you install or provide you with necessary information to start the project.

- automatic development port rotation for frontend and backend
- interactive mode, execute actions through cli gui
- git hooks integration
- build the packages
- serve the bundle (with auto restart)
- test the project
- execute the project with cmd line arguments

#### Git hooks

Pre defined git hooks for quality code writing

- commit msg via commitlint-rs
- pre-commit (test and lint staged files)
- pre-push (test all)

#### CLI arguments

```sh
Command list:
--help [print this help ]
--sync-git-hooks [copy git_hooks folder contents to .git/hooks]
--remove-git-hooks [remove hooks from .git/hooks folder]
--build [build production bundle for frontend and backend]
--serve [start the production server with the frontend build]
--test [run the tests]
--create-toml [create a new Astrox.toml file]
--interactive [start the interactive mode]
--system-checks [run the system checks]
--coverage [run cli and backend coverage]


Cli arguments:
--host="127.0.0.1" [ip address]
--port=8080 [actix port number]
--env=prod / dev [environment]
--astro-port=4321 [astro development port number]
--prod-astro-build=true / false [Build astro during cli prod start]
--set-public-api=https://custom.api/api [cli to astro env creation, used for static server url call building]
```
