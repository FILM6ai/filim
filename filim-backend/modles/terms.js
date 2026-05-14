import mongoose from 'mongoose';

const termsPageSchema = new mongoose.Schema({
    content: { type: String },
});

const termSchema = mongoose.models.term || mongoose.model('term', termsPageSchema);
export default termSchema;
