// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Word from '../models/Words.js';

// dotenv.config();

// const wordsList = `
// apple banana orange mango grape lemon cherry peach strawberry watermelon
// table chair sofa bed lamp curtain shelf drawer mirror window door
// school pencil pen book notebook eraser sharpener backpack uniform exam
// car bus train bicycle truck scooter airplane boat van engine
// dog cat horse cow sheep goat rabbit tiger lion bear
// doctor nurse teacher engineer lawyer artist farmer pilot chef plumber
// sun moon star cloud rain snow wind fog thunder lightning
// red blue green yellow pink purple orange black white brown
// happy sad angry excited scared nervous surprised bored tired calm
// run jump walk sleep eat drink read write draw sing
// mother father sister brother uncle aunt cousin grandparent child baby
// mountain river ocean lake forest desert island valley hill beach
// shirt pants dress shoes hat gloves socks belt jacket coat
// computer laptop phone tablet camera printer keyboard mouse screen monitor
// bread rice pasta meat fish egg cheese milk butter yogurt
// football cricket tennis basketball baseball hockey volleyball golf swimming boxing
// cup plate bowl spoon fork knife glass pan stove oven
// north south east west up down left right front back
// January February March April May June July August September October
// Sunday Monday Tuesday Wednesday Thursday Friday Saturday holiday weekend weekday
// fast slow hot cold wet dry clean dirty loud quiet
// city town village street road bridge tunnel station airport harbor
// country state capital border map flag language currency money coin
// king queen prince princess knight soldier army castle crown sword
// laugh cry smile frown shout whisper talk listen hear see
// high low big small thick thin long short wide narrow
// open close start stop go come bring take give send
// plant tree flower grass leaf root branch seed garden forest
// time clock watch calendar hour minute second morning night noon
// zero one two three four five six seven eight nine
// circle square triangle rectangle oval diamond cube cone sphere cylinder
// iron gold silver copper plastic rubber glass paper wood cloth
// yes no maybe please thanks sorry hello goodbye welcome farewell
// who what where when why how which whose either neither
// first second third fourth fifth sixth seventh eighth ninth tenth
// always never often sometimes rarely usually already yet still then
// work play study teach learn think understand remember forget create
// buy sell pay cost earn spend save borrow lend owe
// love hate like dislike want need choose prefer hope wish
// clean wash brush comb bathe dry wear carry fold hang
// fly swim dive climb ride drive sail jump skip crawl
// push pull lift drop hold throw catch hit kick roll
// cook bake boil fry roast steam chop stir mix taste
// look watch glance stare view observe notice examine scan check
// build fix break cut shape mold glue tie sew paint
// sing dance act draw paint sculpt carve design compose write
// `.trim().split(/\s+/); // This gives 500 words

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected');

//     await Word.deleteMany({});
//     await Word.insertMany(wordsList.map(word => ({ text: word })));

//     console.log('✅ Seeded 500 words into DB');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Seeding failed:', error);
//     process.exit(1);
//   }
// };

// seedDatabase(); // ✅ Call it here


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Words.js';

dotenv.config();

// Basic words list (your existing list)
const wordsList = `
apple banana orange mango grape lemon cherry peach strawberry watermelon
table chair sofa bed lamp curtain shelf drawer mirror window door
school pencil pen book notebook eraser sharpener backpack uniform exam
car bus train bicycle truck scooter airplane boat van engine
dog cat horse cow sheep goat rabbit tiger lion bear
doctor nurse teacher engineer lawyer artist farmer pilot chef plumber
sun moon star cloud rain snow wind fog thunder lightning
red blue green yellow pink purple orange black white brown
happy sad angry excited scared nervous surprised bored tired calm
run jump walk sleep eat drink read write draw sing
mother father sister brother uncle aunt cousin grandparent child baby
mountain river ocean lake forest desert island valley hill beach
shirt pants dress shoes hat gloves socks belt jacket coat
computer laptop phone tablet camera printer keyboard mouse screen monitor
bread rice pasta meat fish egg cheese milk butter yogurt
football cricket tennis basketball baseball hockey volleyball golf swimming boxing
cup plate bowl spoon fork knife glass pan stove oven
north south east west up down left right front back
January February March April May June July August September October
Sunday Monday Tuesday Wednesday Thursday Friday Saturday holiday weekend weekday
fast slow hot cold wet dry clean dirty loud quiet
city town village street road bridge tunnel station airport harbor
country state capital border map flag language currency money coin
king queen prince princess knight soldier army castle crown sword
laugh cry smile frown shout whisper talk listen hear see
high low big small thick thin long short wide narrow
open close start stop go come bring take give send
plant tree flower grass leaf root branch seed garden forest
time clock watch calendar hour minute second morning night noon
zero one two three four five six seven eight nine
`.trim().split(/\s+/);

// Content with punctuation and capitalization
const punctuationContent = [
  "The quick brown fox jumps over the lazy dog.",
  "Hello, world! How are you doing today?",
  "Please remember to bring your umbrella; it might rain later.",
  "She said, \"I'll be there by 5:00 PM.\"",
  "Is this the right way to go? I'm not sure anymore.",
  "After a long day, I enjoy reading a good book.",
  "The concert was amazing - the best I've seen this year!",
  "First, add the flour; second, mix in the eggs; finally, add milk.",
  "When in doubt, leave it out. That's my editing motto.",
  "Wait! Don't forget your keys before you leave."
];

// Content with numbers
const numberContent = [
  "In 2023, there were 365 days just like most years.",
  "The package weighs 2.5 kg and measures 30x40x20 cm.",
  "Please dial 555-123-4567 to reach customer service.",
  "The price of the item is $19.99 plus 8.5% tax.",
  "My flight, AC792, departs at 10:45 AM from Gate 22B.",
  "The apartment is 1,200 sq. ft. with 3 bedrooms and 2 baths.",
  "According to the survey, 78% of participants agreed with the statement.",
  "The recipe requires 350g of flour and 250ml of milk.",
  "The code to unlock the door is 39405, don't forget it!",
  "The meeting is scheduled for January 15th, 2025 at 3:30 PM."
];

// Famous quotes
const quoteContent = [
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
  "If you look at what you have in life, you'll always have more. - Oprah Winfrey",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "You miss 100% of the shots you don't take. - Wayne Gretzky"
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Drop existing collection
    await Word.deleteMany({});
    
    // Insert basic words with 'word' type
    await Word.insertMany(wordsList.map(word => ({ 
      text: word,
      type: 'word'
    })));
    
    // Insert punctuation content
    await Word.insertMany(punctuationContent.map(sentence => ({
      text: sentence,
      type: 'punctuation'
    })));
    
    // Insert number content
    await Word.insertMany(numberContent.map(sentence => ({
      text: sentence,
      type: 'number'
    })));
    
    // Insert quote content
    await Word.insertMany(quoteContent.map(quote => ({
      text: quote,
      type: 'quote'
    })));

    console.log(`✅ Seeded database with multiple content types`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();