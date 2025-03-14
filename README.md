# TOAD

Hosted at https://toad-b0980.web.app/

## Notion

Scrum Board and Documentation: https://www.notion.so/TOAD-17c4dfbbcda280c988afc8c6bbb13b2e

## Node Package Installation

After cloning the repository, run this to install necessary packages:

```
npm install
```

Note: you may have to run this instead if problems pop up:

```
npm install --legacy-peer-deps
```

## Development Building and Testing

To test the site using Vite, run:

```
npm run dev
```

To build the site (into `/build/`), run:

```
npm run build
```

To run the build, run:

```
npm run start
```

## Unit Testing

To do a check up on the database, run:

```
npm run test-database
```

## Deployment

To deploy, run:

```
firebase deploy
```

This will deploy whatever is in the `/build/` directory. Also, you must be signed in with firebase.
