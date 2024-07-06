import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => {
  console.log("Redis error: " + err);
});

app.post("/submit", async (req, res) => {
  const { problemId, language, code } = req.body;

  try {
    await client.lPush(
      "problems",
      JSON.stringify({ problemId, language, code })
    );
    //Store in DB
    res.status(200).send("Submission received and stored.");
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Failed to store submission.");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Client runnung on Port 3000");
    });
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
}

startServer();
