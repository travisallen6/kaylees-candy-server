import { TimeSlot } from '../models'
import connectToMongo from './connectToMongo'
import { config } from '../common'

void (async () => {
  try {
    const timeSlots = [
      {
        date: new Date(2019, 7, 30),
        slots: ['2:30-4:30', '4:30-6:30', '6:30-8:30']
      },
      {
        date: new Date(2019, 7, 31),
        slots: ['10:00-12:00', '12:00-2:00', '2:00-4:00']
      },
      {
        date: new Date(2019, 8, 3),
        slots: ['5:00-7:00']
      },
    ]
    await connectToMongo(config.mongodbUri)
    const result = await TimeSlot.deleteMany({})
    const slots = await TimeSlot.insertMany(timeSlots);
    console.log({ slots, result })
  } catch (error) {
    console.log(error)
  }
})()