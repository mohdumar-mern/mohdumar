import mongoose from 'mongoose';

export default async function teardown() {
  await mongoose.connection.close();
}