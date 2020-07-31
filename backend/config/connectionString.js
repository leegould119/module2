const connectionString = {
  mongoose: {
    connectionString: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2bkud.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }
  }
};

module.exports = connectionString;
