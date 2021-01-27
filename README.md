# local-library

## Creating the local project

### Create the project

Create a project using Express Generator

```bash
express express-locallibrary-tutorial --view=pug
```

### Install all dependencies

```bash
cd express-locallibrary-tutorial
npm install
```

### Enable server restart on file changes

Install `nodemon`

```bash
npm install --save-dev nodemon
```

### Enable the application to use `nodemon`

Change your `scripts` section to be as follows:

```json
"scripts": {
  "start": "node ./bin/www",
  "devstart": "nodemon ./bin/www",
  "serverstart": "DEBUG=express-locallibrary-tutorial:* npm run devstart"
},
```

### Run the app

```bash
npm run devstart
```

## Setting up the database

### Install Mongoose and MongoDB

```bash
npm install mongoose
```

We'll be using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud-based *database as a service* free tier to provide the database. Go to the [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) page and create a free cluster.

