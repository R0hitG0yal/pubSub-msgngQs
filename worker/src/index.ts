import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  // Here you would add your actual processing logic

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  try {
    client.connect();
    console.log("Connected to Redis server");

    while (true) {
      try {
        const submission = await client.brPop("problems", 0);
        await processSubmission(submission);
      } catch (e) {
        console.log("Submission failed: ", e);
        // Implement your error handling logic here. For example, you might want to push
        // the submission back onto the queue or log the error to a file.

        // await client.lPush("problems", submission);
        // console.log("Submission pushed back onto the queue.");
      }
    }
  } catch (e) {
    console.log("Failed to connect to Redis server : " + e);
  }
}
