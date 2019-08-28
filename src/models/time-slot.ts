import * as mongoose from 'mongoose';

export interface ITimeSlot extends mongoose.Document {
  date: Date;
  slots: string[]
}

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  slots: {
    type: [String],
    required: true
  }
});

export default mongoose.model<ITimeSlot>('time-slot', timeSlotSchema);
