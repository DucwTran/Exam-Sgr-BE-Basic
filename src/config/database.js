import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Success");
  } catch (error) {
    console.log("Connect Error:", error.message);
  }
};

export default connect;
