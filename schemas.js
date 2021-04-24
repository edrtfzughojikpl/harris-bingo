const mongoose = require('mongoose');

const bingoSchema = new mongoose.Schema({
  text: String
});

const checkedBingosSchema = new mongoose.Schema({
  number: String
});

module.exports = {
  bingoSchema,
  checkedBingosSchema
}