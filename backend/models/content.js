import mongoose from 'mongoose';

const contentSchema = mongoose.Schema({
  show_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  director: String,
  cast: [String],
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  category: [String],
  description: String,
  banner_picture_url: String,
  title_url: String
}, {
  timestamps: true
});
contentSchema.index({ title: 'text'});  
const Content = mongoose.model('Content', contentSchema);

export default Content;
