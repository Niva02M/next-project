## Getting Started

### Prerequisite

- nodejs
- docker
- `npm` or `yarn` globally installed
- updated `.env`

#### Run the development server:

```bash
npm run dev
# or
yarn dev
```

#### For running with docker image:

```bash
docker run -d --name <container_name> -p <container_port>:<app_port> <image_name>
```

#### Or, running with docker compose:

```bash
docker compose up
```

#### install node_modules in docker environment:

```bash
docker compose run <container_name> yarn
```

#### build the project in docker environment:

```bash
docker compose run <container_name> yarn build
```

#### preview the build project in docker environment:

```bash
docker compose run <container_name> yarn preview
```

#### remove node_modules folder from docker environment:

```bash
docker compose run <container_name> rm -rf node_modules
```

### Next Steps

- To add modules like menus, pages, or faqs on seed version, please follow this [document.](https://docs.google.com/document/d/14SeG1WAdBP2J-qLgIUHfREy696BuWWuM0ubwsLEpA6E/edit#heading=h.pa6qk8h30wl4)

- Browse to `localhost:<container_port>` to view the application
