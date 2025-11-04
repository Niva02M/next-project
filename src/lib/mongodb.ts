import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any)._mongo || {
  conn: null,
  promise: null
};

if (!cached.promise) {
  cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
    return mongoose;
  });
  (global as any)._mongo = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise!;
  return cached.conn;
}
