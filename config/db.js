module.exports = async function (mongoose) {
  const con = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  if (con) console.log(`database is connected to: ${con.connection.host}`);
};
