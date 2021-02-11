#! /usr/bin/env node

// console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Book = require("./models/book");
var Author = require("./models/author");
var Genre = require("./models/genre");
var BookInstance = require("./models/bookinstance");

var authorsList = require("./data/authors.json");
var booksList = require("./data/books.json");
var bookInstancesList = require("./data/bookinstances.json");
var genresList = require("./data/genres.json");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var books = [];
var bookinstances = [];

function bookCreate(title, summary, isbn, author, genre, cb) {
  bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn,
  };
  if (genre != false) bookdetail.genre = genre;

  var book = new Book(bookdetail);
  book.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Book: " + book);
    books.push(book);
    cb(null, book);
  });
}

function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = {
    book: book,
    imprint: imprint,
  };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;

  var bookinstance = new BookInstance(bookinstancedetail);
  bookinstance.save(function (err) {
    if (err) {
      console.log("ERROR CREATING BookInstance: " + bookinstance);
      cb(err, null);
      return;
    }
    console.log("New BookInstance: " + bookinstance);
    bookinstances.push(bookinstance);
    cb(null, book);
  });
}

function createGenreAuthors(cb) {
  async.series([
    function (callback) {
      db.collection("authors").insertMany(authorsList, function (err, result) {
        if (err) {
          throw err;
        } else {
          console.log(`${authorsList.length} authors inserted into the DB`);
        }
      });
      callback(null, "create_authors");
    },
    function (callback) {
      db.collection("genres").insertMany(genresList, function (err, result) {
        if (err) {
          throw err;
        } else {
          console.log(`${genresList.length} genres inserted into the DB`);
        }
      });
      callback(null, "create_genres");
    },
    function (results, err) {
      if (err) {
        console.log(
          `Authors and Genres NOT added to the DB`,
          err.message,
          err.stack
        );
      } else {
        console.log(
          `Authors and Genres ARE BEING added to the DB`,
          results.toString()
        );
      }
    },
  ]);
}

function createBooks() {
  async.parallel([
    function (callback) {
      var genre = mongoose.model("Genre", Genre.GenreSchema);
      var author = mongoose.model("Author", Author.AuthorSchema);

      genre.find().exec(function (err, allGenres) {
        if (err) {
          console.log("Error retrieving genres", err.message, err.stack);
          return;
        }
        // console.log('Genres', allGenres);
        // allGenres = genres
        author.find().exec(function (err, allAuthors) {
          console.log(`${allAuthors.length} Authors retrieved`);
          console.log(`${allGenres.length} Genres retrieved`);

          booksList.forEach((book) => {
            // Generates random references
            authorBook =
              allAuthors[Math.floor(Math.random() * allAuthors.length)];
            genreBook = allGenres[Math.floor(Math.random() * allGenres.length)];

            bookCreate(
              book.title,
              book.summary,
              book.isbn,
              authorBook,
              genreBook,
              function () {
                console.log(`Book created`);
              }
            );
          });
        });
      });
    },
    function (results, err) {
      if (err) {
        console.log(`Books NOT added to the DB`, err.message, err.stack);
      } else {
        console.log(`Books ARE BEING added to the DB`, results.toString());
      }
    },
  ]);
}

function createBookInstances() {
  async.parallel([
    function (callback) {
      var book = mongoose.model("Book", Book.GenreSchema);

      book.find().exec(function (err, allBooks) {
        if (err) {
          console.log("Error retrieving books", err.message, err.stack);
          return;
        }

        bookInstancesList.forEach((bookInstance) => {
          // Generates a random reference
          bookReference = allBooks[Math.floor(Math.random() * allBooks.length)];
          bookInstanceCreate(
            bookReference,
            bookInstance.imprint,
            false,
            bookInstance.status,
            function (err, bookInstaceCreated) {
              if (err) console.log(`Book Instance NOT created`, err.message);
              else console.log("Book Instance created");
            }
          );
        });
      });
    },
    function (results, err) {
      if (err) {
        console.log(
          `Books Instances NOT added to the DB`,
          err.message,
          err.stack
        );
      } else {
        console.log(
          `Books Instances ARE BEING added to the DB`,
          results.toString()
        );
      }
    },
  ]);
}

async.series(
  [createGenreAuthors, createBooks, createBookInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + bookinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
