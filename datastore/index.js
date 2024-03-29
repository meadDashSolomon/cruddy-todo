const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFile = Promise.promisify(require("fs").readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // add todos to items object with unique id as key and text as value

  //  get unique ID for new todo
    counter.getNextUniqueId((err, uniqueId) => {
      // err first conditional
      if (err) {
        callback(err);
      } else {
        items[uniqueId] = text;

        // create filename with unique ID
        const filePath = path.join(exports.dataDir, `${uniqueId}.txt`);

      // save todo text to file
        fs.writeFile(filePath, text, (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null, {id: uniqueId, text: text});
          }
        });
      // err first conditional

      // pass todo object to cb on success
      }

    });
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
      const promises = files.map((file) => {
        const filePath = path.join(exports.dataDir, file);
        const fileName = path.basename(file, '.txt');

        return readFile(filePath)
          .then((fileContents) => (
            { "id": fileName, "text": fileContents.toString() }
            ))
          .catch((error) => {
            throw error;
          });
      });

      Promise.all(promises)
        .then((resolvedArray) => {
          callback(null, resolvedArray);
        });
    });
  };





  // read the file names in data directory
  // fs.readdir(exports.dataDir, (err, files) => {
  //   // if err,
  //   if (err) {
  //     // cb with err
  //     callback(err);
  //   }
  //   // edge case
  //   else if (files.length === 0) {
  //     callback(null, [])
  //   } else {
  //     // create variable set to empty array
  //     let toDo = [];
  //     let filesRead = 0;
  //     // iterate over files
  //     files.forEach((file) => {
  //       const filePath = path.join(exports.dataDir, file);
  //       fs.readFile(filePath, (err, text) => {
  //         if (err) {
  //           callback(err);
  //         } else {
  //           const fileName = path.basename(file, '.txt');
  //           toDo.push({"id": fileName, "text": text});
  //           filesRead++;
  //           if (filesRead === files.length) {
  //             callback(null, toDo);
  //           }
  //         }
  //       });
  //     });
        // read each file
        // if err,
          // cb with err
        // else
          // get ID from file
          // push ID and text placeholder to array
          // increment file counter
            // if file counter equals length of files
              // cb with null and array

  //   }
  // });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);


exports.readOne = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {"id": id, "text": fileContent.toString()});
    }
    // edge case for non-existant todo should return error
  })



  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);

  exports.readOne(id, (err) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, text);
        }
      })
    }
  })

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];

  const filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });

  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
