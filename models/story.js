const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const storySchema = new mongoose.Schema({
  refUserId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  category: {
    type: String,
  },
    slides: [slideSchema]
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
