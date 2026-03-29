/**
 * LoveBytes — Daily Prompts
 * World news headlines that become couples' conversation starters.
 * One per day, deterministic by date.
 */
(function (exports) {
  'use strict';

  // 60+ world news-inspired daily prompts
  const PROMPTS = [
    { headline: "Scientists discover high water ice on Mars", question: "If we could live on Mars together, what would our home look like?" },
    { headline: "Global peace summit draws 140 nations", question: "What's one thing you'd change about the world if you could?" },
    { headline: "Breakthrough in renewable energy: solar paint invented", question: "What color would you paint our future house?" },
    { headline: "New deep-sea species discovered in Mariana Trench", question: "What's the deepest secret you haven't told me yet? (fun ones only!)" },
    { headline: "International Space Station celebrates 25 years", question: "Where do you see us in 25 years?" },
    { headline: "AI passes advanced reasoning test", question: "What task would you love a robot to do for you?" },
    { headline: "Record-breaking heatwave across Europe", question: "What's your ideal vacation temperature and why?" },
    { headline: "Cherry blossoms bloom early in Japan", question: "What's the most beautiful thing you've seen this week?" },
    { headline: "New Banksy mural appears in London", question: "If someone painted a mural of our relationship, what would it show?" },
    { headline: "Olympic bid announced for 2036", question: "What sport would we compete in as a duo?" },
    { headline: "World's oldest library digitizes its collection", question: "What book changed your life?" },
    { headline: "Coral reef shows signs of recovery", question: "What gives you hope about the future?" },
    { headline: "Breakthrough in quantum computing announced", question: "If you could instantly learn any skill, what would it be?" },
    { headline: "Global music festival goes virtual", question: "What song reminds you of us?" },
    { headline: "New telescope captures farthest galaxy ever seen", question: "Do you think we're alone in the universe?" },
    { headline: "Endangered species population doubles", question: "What animal best represents our relationship?" },
    { headline: "Underground city discovered in Turkey", question: "What's a secret place you'd love to explore together?" },
    { headline: "Electric planes complete first transatlantic flight", question: "Where would you fly to right now if you could?" },
    { headline: "World population reaches new milestone", question: "What's one tradition you want us to create?" },
    { headline: "Ancient language finally decoded", question: "What's something you wish you could better express to me?" },
    { headline: "Record snowfall blankets Northern Hemisphere", question: "Hot chocolate or coffee? And what's your perfect snow day?" },
    { headline: "Moon base construction begins", question: "Would you live on the Moon with me?" },
    { headline: "Nobel Prize awarded for kindness research", question: "What's the kindest thing someone ever did for you?" },
    { headline: "Time capsule from 1924 opened", question: "What would you put in a time capsule for us to open in 10 years?" },
    { headline: "New island forms from volcanic activity", question: "If we had our own island, what would we name it?" },
    { headline: "World's largest tree house built in Costa Rica", question: "Describe your dream home in 3 words." },
    { headline: "Global internet speed triples", question: "What's the first thing you'd do if we had zero lag video calls?" },
    { headline: "Archaeologists find 3000-year-old love letter", question: "If you had to write me a letter in 10 words or less, what would it say?" },
    { headline: "Northern Lights visible at record-low latitudes", question: "What's on your bucket list that involves us?" },
    { headline: "First baby born in space simulation", question: "Do you want kids? (Or pets? Or houseplants? All valid!)" },
    { headline: "World Happiness Report released", question: "On a scale of 1-10, how happy are you right now? What would make it a 10?" },
    { headline: "New dinosaur species named after pop star", question: "What would your dinosaur name be?" },
    { headline: "Ocean cleanup project removes millionth ton of plastic", question: "What small thing do you do that makes you feel good about the world?" },
    { headline: "Self-driving cars approved in 10 more countries", question: "Road trip! Where are we going and what snacks are we bringing?" },
    { headline: "Major earthquake strikes Pacific region", question: "What's something you're grateful for today?" },
    { headline: "World's longest bridge opens", question: "What bridges the distance between us?" },
    { headline: "New vitamin discovered in common vegetable", question: "What's the last meal you cooked? Scale of 1-10?" },
    { headline: "First commercial space hotel opens", question: "Splurge or save: how would you spend a surprise $10,000?" },
    { headline: "Indigenous language revitalization succeeds", question: "Teach me a word in another language that has no English equivalent." },
    { headline: "Robot completes first solo surgery", question: "What technology amazes you the most?" },
    { headline: "World's oldest person celebrates birthday", question: "What age do you think is the best age to be?" },
    { headline: "Sahara gets rare snowfall", question: "What's the most unexpected thing that happened to you recently?" },
    { headline: "New planet discovered in habitable zone", question: "If you could name a planet, what would you call it?" },
    { headline: "Global volunteer day breaks participation record", question: "What cause do you care most about?" },
    { headline: "Fastest human runs 100m in record time", question: "What personal record are you proud of?" },
    { headline: "Lost Van Gogh painting found in attic", question: "What's hiding in your attic/closet that I'd be surprised by?" },
    { headline: "Coffee shortage predicted for next decade", question: "Morning person or night owl? What's your ideal morning routine?" },
    { headline: "Deepfake detection AI achieves 99% accuracy", question: "What's one thing about you that's 100% authentically you?" },
    { headline: "Giant panda population reaches stable level", question: "Send me your best animal impression (describe it!)" },
    { headline: "Mars rover discovers organic compounds", question: "What discovery would blow your mind the most?" },
    { headline: "Global literacy rate hits all-time high", question: "What's the last thing you read that stuck with you?" },
    { headline: "Undersea cable connects all continents", question: "What keeps us connected across the distance?" },
    { headline: "World's largest solar farm powers entire city", question: "What energizes you when you're running low?" },
    { headline: "Ancient DNA reveals surprise migration patterns", question: "Where are your ancestors from? Any cool family stories?" },
    { headline: "New emoji set released with 100 additions", question: "Pick 3 emojis that describe our relationship." },
    { headline: "Breakthrough in memory research", question: "What's your favorite memory of us?" },
    { headline: "Arctic expedition finds perfectly preserved forest", question: "What do you want to preserve about our relationship forever?" },
    { headline: "Global streaming platform reaches 1 billion users", question: "What should we watch together next?" },
    { headline: "Rain garden movement transforms urban spaces", question: "If you could redesign our future neighborhood, what would it have?" },
    { headline: "Whale song decoded for first time", question: "If you could talk to any animal, which one and what would you ask?" },
  ];

  function getPromptForDate(dateStr) {
    const d = new Date(dateStr || Date.now());
    const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return PROMPTS[dayOfYear % PROMPTS.length];
  }

  function getTodaysPrompt() {
    return getPromptForDate(new Date().toISOString());
  }

  function getPromptCount() {
    return PROMPTS.length;
  }

  exports.PROMPTS = PROMPTS;
  exports.getPromptForDate = getPromptForDate;
  exports.getTodaysPrompt = getTodaysPrompt;
  exports.getPromptCount = getPromptCount;

})(typeof window !== 'undefined' ? window : module.exports);
