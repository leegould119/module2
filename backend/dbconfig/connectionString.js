// MOGO DATABASE + SERVER
// USERNAME
// PASSWORD
// CLUSTER NAME [@cluster0.2bkud.mongodb.net]
// DBNAME [anything i waqnt it to be]
// VARIABLES

// mongodb+srv://< username >:< password >@< cluster name >/< dbname >?retryWrites=true&w=majority

const connectionString = {
  mongoose: {
    connectionString: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTERNAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};
module.exports = connectionString;
