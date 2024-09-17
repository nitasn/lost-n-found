import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });

const systemPromt = `
act as a super-strict image classifier. 
your task is to generate comma separated descriptions for given image(s).
you must not produce any additional text; for example, do not write "here are some descriptions".
instead, reply with comma separated short descriptions and nothing more.
also, the description must be very very succinct.
do not write "some images of a card that seems to be used for paying for transportation like buses or alike";
instead, prefer very short phrases of up to 4 words; for instance, you could write "transportation card".
one last but important thing: ignore the background.
for example, prefer "keychain" over "keychain held in hand", and prefer "dress" over "dress laid on table".
`;

const imagePrompt = `
the following is one or more image(s) for you to describe shortly as discussed.
reply with very succinct comma separated descriptions of what's in the image(s).
`;

function messagesForImages(urls) {
  return [
    { role: "system", content: systemPromt.trim() },
    { role: "system", content: imagePrompt.trim() },
    {
      role: "user",
      content: urls.map((url) => ({ type: "image_url", image_url: { url } })),
    },
  ];
}

export default async function getImagesTagsFromAI(imageURLs) {
  const chatCompletion = await openai.chat.completions.create({
    messages: messagesForImages(imageURLs),
    model: "gpt-4o-mini",
    max_tokens: 20,
    temperature: 0.3,
  });

  const { content, refusal } = chatCompletion.choices[0].message;
  return refusal || content;
}

async function testAI() {
  const imgURLs = [
    // images for mazda car keys
    "https://wholesalegaragedoors.com.au/wp-content/uploads/2023/12/Mazda-Car-Key-Remote-Replacement-AOMA-CK02-8-scaled.jpg",
    "https://smartwrh.com/storage/images/products/gallery/2d3338325821409190ebe19f9ad092e5.jpg",
  ];

  const dressOnWoodedDeck = [
    "https://files.oaiusercontent.com/file-utvB1jzS8wec5eNmxzjhtakZ?se=2024-09-17T20%3A13%3A47Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Db4b2f1fe-678e-4f9b-86d3-9067f9e3512b.webp&sig=bzk85edchRFb2BysHTyZOjtd7xP4YR4dtexJfcphxXc%3D"
  ]
  
  console.log(await getImagesTagsFromAI(dogOnGrass));
}