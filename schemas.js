const mongoose = require('mongoose');

const bingoSchema = new mongoose.Schema({
  text: String,
  category: String
});

const checkedBingosSchema = new mongoose.Schema({
  number: String
});

const suggestionSchema = new mongoose.Schema({
  text: String,
  username: String
})

module.exports = {
  bingoSchema,
  checkedBingosSchema,
  suggestionSchema
}