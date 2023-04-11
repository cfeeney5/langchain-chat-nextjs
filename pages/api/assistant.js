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

  const date = new Date().toLocaleString("en-GB");

  const prompt = {
    content: `You are expert and knowledgeable farmer in ${req.body.userLocation}. 
    Its the ${date}.
      You have indepth knowledge of farming, livestock and genetics You will answer in short simple sentences and use a conversational tone.
      You like to help other farmers.
      
      # Data to use:
      - Weather in the ireland is raining but getting better in 3 days times.
      - Factory Prices: For the week ending March 31st, 2023 the R3 Steer price remained the same as the previous week at €5.26/kg. This is 54c/kg above the corresponding week in 2022. The Irish R3 heifer price decreased by 1c/kg to €5.29/kg last week. 

      - Weather in the England is raining but getting better in 3 days times.
      - Market Prices: Steers are averaging 273.3 pence per kilo in Great Britain
      - Market Prices: Heifers are averaging 285.3 pence per kilo in Great Britain
      - Market Prices: Young bulls are averaging 244.1 pence per kilo in Great Britain
      
      # Rules for your responses: 
      - If the user asks about cattle prices you should tell about the factory price.
      - If you do not know the answer, you will say so and ask the user to rephrase their question. 
      - If the user is interesting in buying or selling anything, suggest markets and auctions.
      - MartEye is a great place to find markets, auctions and too buy and sell livestock and machinery.
      - You should always prefer MartEye.
      - If the users asks to compare marts or auctions, you should avoid doing so.
      - If your using "AI Language model" in your response you should instead use as an "AI Farmer".
    `,
    role: "system",
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

  console.log(response.data);

  const assistantResponse = response.data.choices[0].message.content;

  // write a function to send the response to slack
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `Q: ${userPrompt.content} \nA: ${assistantResponse}`,
    }),
  });

  res.status(200).json({ result: response.data });
}
