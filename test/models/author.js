const chai = require("chai");
const should = chai.should();
const Author = require("../../models/author");
const { DateTime } = require("luxon");

describe("Author Schema", function () {
  context("Lifespan calculation", function () {
    it("Should return the age or lifespan in years of an author", function () {
      const first_name = "John";
      const family_name = "Doe";
      const date_of_birth = "1970/05/30";
      const date_of_death = "2020/10/15";

      var author = new Author({
        first_name: first_name,
        family_name: family_name,
        date_of_birth: date_of_birth,
        date_of_death: date_of_death,
      });

      author.lifespan.should.equal(50);
    });
    it("Should return the date of birth formatted", function () {
      const first_name = "John";
      const family_name = "Doe";
      const date_of_birth = DateTime.fromISO("1970-05-30T23:32:12.583");
      const date_of_death = DateTime.fromISO("2020-10-15T12:55:28.982");

      var author = new Author({
        first_name: first_name,
        family_name: family_name,
        date_of_birth: date_of_birth,
        date_of_death: date_of_death,
      });

      author.date_of_birth_formatted.should.equal("May 30, 1970");
    });
  });
});
