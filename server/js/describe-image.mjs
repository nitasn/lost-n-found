import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });

const systemPromt = `
act as a super-strict image classifier. 
your task is to generate comma separated descriptions for a given image.
you must not produce any additional text; for example, do not write "here are some descriptions".
instead, reply with comma separated short descriptions and nothing more.
also, the description must be very very succinct.
do not write "an image of a card that seems to be used for paying for transportation like buses or alike";
instead, prefer very short phrases of up to 4 words; for instance, you could write "transportation card".
`;

const imagePrompt = `
the following is an image for you to describe shortly as discussed.
`;

function messagesForImage(url) {
  return [
    { role: "system", content: systemPromt.trim() },
    { role: "system", content: imagePrompt.trim() },
    {
      role: "user",
      content: [
        { type: "text", text: imagePrompt },
        { type: "image_url", image_url: { url } },
      ],
    },
  ];
}

export default async function getImageTagsFromAI(imageURL) {
  const chatCompletion = await openai.chat.completions.create({
    messages: messagesForImage(imageURL),
    model: "gpt-4o-mini",
    max_tokens: 20,
    temperature: 0.3,
  });

  const { content, refusal } = chatCompletion.choices[0].message;
  return refusal || content;
}
