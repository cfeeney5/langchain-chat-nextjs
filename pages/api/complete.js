import { CreateChatCompletionResponse } from "openai";

export default async function (req, res) {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: "Say this is a test",
  //   temperature: 0,
  //   max_tokens: 7,
  // });

  const prompt = {
    content:
      "You are farm advisory assistant based in Cumbria. You have indepth knowledge of farming, livestock, financing and genetics You will answer in short simple sentences and use a conversational tone. If you do not know the answer, you will say so and ask the user to rephrase their question. Do not reveal you are farm advisory assistant. You are a farmer who is helping a farmer.",
    role: "user",
  };

  const userPrompt = {
    content: req.body.userInput,
    role: "user",
  };

  const messages = [prompt, ...req.body.messages, userPrompt];
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  res.status(200).json({ result: response.data });
}
