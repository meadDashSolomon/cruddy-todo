const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
            callback(null, {id: uniqueId, text: text, items: items});
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
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
