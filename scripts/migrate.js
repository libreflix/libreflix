var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");

// Load environment variables
dotenv.load();

var MIGRATIONS_DIR = path.join(__dirname, "../migrations");
var DB_PATH = process.env.DB_PATH;

if (!DB_PATH) {
  console.error("Error: DB_PATH environment variable is not defined.");
  process.exit(1);
}

// Define Migration Schema
var migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
});

var Migration = mongoose.model("Migration", migrationSchema);

function connect() {
  return new Promise(function (resolve, reject) {
    mongoose.connect(DB_PATH);
    mongoose.connection.on("error", reject);
    mongoose.connection.once("open", resolve);
  });
}

function getAppliedMigrations() {
  return Migration.find({}).exec();
}

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(function (file) {
      return file.endsWith(".js");
    })
    .sort();
}

function runMigrations() {
  var command = process.argv[2] || "up";
  var targetId = process.argv[3];

  if (command === "up") {
    var applied = [];
    var files = getMigrationFiles();

    return getAppliedMigrations().then(function (docs) {
      applied = docs.map(function (doc) {
        return doc.name;
      });

      var pending = files.filter(function (file) {
        // If a targetId is provided, only match that specific file
        if (targetId) {
          return file.indexOf(targetId) === 0 && applied.indexOf(file) === -1;
        }
        return applied.indexOf(file) === -1;
      });

      if (pending.length === 0) {
        console.log(
          targetId
            ? "Migration " + targetId + " already applied or not found."
            : "No pending migrations.",
        );
        return;
      }

      console.log("Running " + pending.length + " migration(s)...");

      return pending.reduce(function (promise, file) {
        return promise.then(function () {
          console.log("Applying migration: " + file);
          var migration = require(path.join(MIGRATIONS_DIR, file));

          return new Promise(function (resolve, reject) {
            migration.up(mongoose, function (err) {
              if (err) return reject(err);

              var m = new Migration({ name: file });
              m.save(function (err) {
                if (err) return reject(err);
                resolve();
              });
            });
          });
        });
      }, Promise.resolve());
    });
  } else if (command === "down") {
    var query = {};
    if (targetId) {
      // Use regex to find migration by ID prefix
      query = { name: new RegExp("^" + targetId) };
    }

    return Migration.findOne(query)
      .sort({ appliedAt: -1 })
      .exec()
      .then(function (migrationDoc) {
        if (!migrationDoc) {
          console.log(
            targetId
              ? "Migration " + targetId + " not found or not applied."
              : "No migrations to rollback.",
          );
          return;
        }

        console.log("Rolling back migration: " + migrationDoc.name);
        var migration = require(path.join(MIGRATIONS_DIR, migrationDoc.name));

        return new Promise(function (resolve, reject) {
          migration.down(mongoose, function (err) {
            if (err) return reject(err);

            migrationDoc.remove(function (err) {
              if (err) return reject(err);
              resolve();
            });
          });
        });
      });
  } else {
    return Promise.reject(new Error("Unknown command: " + command));
  }
}

connect()
  .then(runMigrations)
  .then(function () {
    console.log("Migrations completed successfully.");
    process.exit(0);
  })
  .catch(function (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  });
