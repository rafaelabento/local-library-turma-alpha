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

We'll be using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud-based _database as a service_ free tier to provide the database. Go to the [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) page and create a free cluster.

Go to the `Collections` tab and create a new database named `local_library` and enter the name of the collection as `Collection0`. Set the connection to `Allow Access from Anywhere`.

### Install `async` dependency

The `async` dependency is used by the script that generates some random data.

```bash
npm install async
```

### Run the script do populate the database

Download the [`populatedb.js`](https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js) file in the root of your directory and run:

```bash
node populatedb <your mongodb url>
```

You can also use [Mockaroo](https://www.mockaroo.com/) to generate some mock data. Some are available in the `data/` folder. For that, you'll need to install `async`:

```bash
npm install async
```
