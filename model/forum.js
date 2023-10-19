const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.pluralize(null);

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    username: String, // The author's username for quick access
  },
  category: {
    type: String, // You can create a separate category schema and reference it
  },
  tags: {
    type: [String], // Array of tags for categorization and search
  },
  comments: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      message:{type:String}
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  media: [
    {
      filename: String, // Original file name
      url: String, // URL to the media file (e.g., stored in cloud storage)
      type: String, // MIME type (e.g., 'image/jpeg', 'video/mp4')
    },
  ],
}, { timestamps: true });

forumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Forum', forumSchema);
