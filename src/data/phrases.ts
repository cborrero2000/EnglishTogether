export type Phrase = { id: string; english: string; meaning: string; topic: string };

export const phrases: Phrase[] = [
  // GREETINGS
  { id: "p1",  english: "Nice to meet you.",                        meaning: "A friendly thing to say when you meet someone for the first time.",     topic: "Greetings" },
  { id: "p2",  english: "How are you today?",                       meaning: "Asking someone how they feel right now.",                               topic: "Greetings" },
  { id: "p3",  english: "Have a great day!",                        meaning: "A kind goodbye wish.",                                                  topic: "Greetings" },
  { id: "p4",  english: "Good morning! Nice to see you.",           meaning: "A warm greeting in the morning to someone you know.",                   topic: "Greetings" },
  { id: "p5",  english: "See you tomorrow!",                        meaning: "A goodbye when you'll see the person again the next day.",               topic: "Greetings" },
  { id: "p6",  english: "How have you been?",                       meaning: "Asking someone about their life lately, someone you haven't seen in a while.", topic: "Greetings" },
  { id: "p7",  english: "Welcome! Please come in.",                 meaning: "Inviting someone to enter your home or a place.",                       topic: "Greetings" },
  // POLITENESS
  { id: "p8",  english: "Thank you very much.",                     meaning: "Saying you are very grateful.",                                         topic: "Politeness" },
  { id: "p9",  english: "Excuse me, can you help me?",             meaning: "Politely asking someone for help.",                                     topic: "Politeness" },
  { id: "p10", english: "I'm sorry about that.",                    meaning: "Apologizing for something that happened.",                              topic: "Politeness" },
  { id: "p11", english: "Please don't worry about it.",             meaning: "Telling someone that their mistake or problem is not a big deal.",       topic: "Politeness" },
  { id: "p12", english: "You're welcome!",                          meaning: "What you say after someone thanks you.",                                topic: "Politeness" },
  { id: "p13", english: "That's very kind of you.",                 meaning: "Expressing gratitude for something nice someone said or did.",           topic: "Politeness" },
  { id: "p14", english: "After you, please.",                       meaning: "Inviting someone to go before you through a door or in a line.",        topic: "Politeness" },
  // DIRECTIONS
  { id: "p15", english: "Where is the train station?",              meaning: "Asking for the location of the train station.",                         topic: "Directions" },
  { id: "p16", english: "Turn left at the traffic light.",          meaning: "Instructions to turn in the left direction at the traffic light.",      topic: "Directions" },
  { id: "p17", english: "Go straight for two blocks.",              meaning: "Instructions to walk forward without turning for two blocks.",          topic: "Directions" },
  { id: "p18", english: "It's on the right side of the street.",    meaning: "Telling someone which side of the street something is on.",             topic: "Directions" },
  { id: "p19", english: "How far is it from here?",                 meaning: "Asking the distance to a place.",                                      topic: "Directions" },
  { id: "p20", english: "Is there a bus stop nearby?",              meaning: "Asking if there is a place to catch a bus close to you.",               topic: "Directions" },
  // SHOPPING
  { id: "p21", english: "How much does this cost?",                 meaning: "Asking the price of something.",                                        topic: "Shopping" },
  { id: "p22", english: "I would like to pay with my card.",        meaning: "Telling the cashier you will use a bank card.",                         topic: "Shopping" },
  { id: "p23", english: "Do you have this in a larger size?",       meaning: "Asking if a product is available in a bigger size.",                    topic: "Shopping" },
  { id: "p24", english: "I'd like to return this, please.",         meaning: "Telling a store you want to give something back and get your money.",   topic: "Shopping" },
  { id: "p25", english: "Is there a sale on today?",                meaning: "Asking if there are any discounts available.",                          topic: "Shopping" },
  { id: "p26", english: "Where can I find the bread?",              meaning: "Asking where bread is located in a store.",                             topic: "Shopping" },
  { id: "p27", english: "Could I have a receipt, please?",          meaning: "Asking for a printed or digital proof of your purchase.",               topic: "Shopping" },
  { id: "p28", english: "I'm just looking, thank you.",             meaning: "Telling a store worker you don't need help right now.",                 topic: "Shopping" },
  // RESTAURANT
  { id: "p29", english: "Can I have a glass of water?",             meaning: "Politely asking for some water to drink.",                              topic: "Restaurant" },
  { id: "p30", english: "The bill, please.",                        meaning: "Asking the waiter for what you owe.",                                   topic: "Restaurant" },
  { id: "p31", english: "What do you recommend?",                   meaning: "Asking the waiter for their suggestion on what to order.",              topic: "Restaurant" },
  { id: "p32", english: "I am allergic to peanuts.",                meaning: "Telling someone you cannot eat peanuts because they make you sick.",    topic: "Restaurant" },
  { id: "p33", english: "Could we have more napkins, please?",      meaning: "Asking the waiter for extra paper napkins.",                            topic: "Restaurant" },
  { id: "p34", english: "Is this dish spicy?",                      meaning: "Asking if the food has a lot of hot spices in it.",                    topic: "Restaurant" },
  { id: "p35", english: "The food was delicious, thank you.",       meaning: "Complimenting the restaurant after your meal.",                        topic: "Restaurant" },
  // EVERYDAY LIFE
  { id: "p36", english: "What time is it now?",                     meaning: "Asking for the current time.",                                          topic: "Everyday" },
  { id: "p37", english: "I don't understand. Can you repeat that?", meaning: "Asking someone to say something again because you didn't understand.",  topic: "Everyday" },
  { id: "p38", english: "My appointment is at four thirty.",        meaning: "Telling someone the time of your meeting.",                             topic: "Everyday" },
  { id: "p39", english: "Could you speak more slowly, please?",     meaning: "Asking someone to talk at a slower speed.",                             topic: "Everyday" },
  { id: "p40", english: "I locked my keys in the car.",             meaning: "Telling someone you accidentally left your keys inside your locked car.", topic: "Everyday" },
  { id: "p41", english: "What time does the library close?",        meaning: "Asking the closing time of the library.",                               topic: "Everyday" },
  { id: "p42", english: "Can you help me carry this?",              meaning: "Asking someone to help you hold or move something heavy.",              topic: "Everyday" },
  { id: "p43", english: "I need to pick up my children from school.", meaning: "Saying you need to go get your children at school.",                  topic: "Everyday" },
  // HEALTH
  { id: "p44", english: "I am not feeling well today.",             meaning: "Telling someone you are a little sick.",                                topic: "Health" },
  { id: "p45", english: "I need to see a doctor.",                  meaning: "Saying you need a medical appointment.",                                topic: "Health" },
  { id: "p46", english: "How often should I take this medicine?",   meaning: "Asking how many times per day to use a medication.",                   topic: "Health" },
  { id: "p47", english: "I have a headache.",                       meaning: "Telling someone your head hurts.",                                     topic: "Health" },
  { id: "p48", english: "I've been feeling very tired lately.",     meaning: "Saying you have had low energy for several days.",                      topic: "Health" },
  { id: "p49", english: "My back has been hurting for three days.", meaning: "Telling the doctor about pain in your back that started three days ago.", topic: "Health" },
  { id: "p50", english: "Is this medication safe with food?",       meaning: "Asking if it's okay to take medicine while eating.",                   topic: "Health" },
  // PHONE
  { id: "p51", english: "Hello, this is Maria speaking.",           meaning: "How you introduce yourself when answering or making a phone call.",     topic: "Phone" },
  { id: "p52", english: "Could I leave a message, please?",         meaning: "Asking to leave a note for someone who is not available.",              topic: "Phone" },
  { id: "p53", english: "I'll call you back in a few minutes.",     meaning: "Telling someone you will telephone them again soon.",                   topic: "Phone" },
  { id: "p54", english: "Can you speak a little louder?",           meaning: "Asking someone to raise their voice because you can't hear them well.", topic: "Phone" },
  { id: "p55", english: "I'm calling to confirm my appointment.",   meaning: "Calling to make sure your scheduled appointment is still happening.",  topic: "Phone" },
  { id: "p56", english: "Is this a good time to talk?",             meaning: "Asking if the person is free and comfortable to have a conversation.",  topic: "Phone" },
  // MAKING PLANS
  { id: "p57", english: "Are you free this Saturday?",              meaning: "Asking if someone has no plans and is available on Saturday.",          topic: "Plans" },
  { id: "p58", english: "What time should we meet?",                meaning: "Asking for a meeting time to agree on.",                               topic: "Plans" },
  { id: "p59", english: "Let me check my calendar.",                meaning: "Saying you need to look at your schedule before confirming.",           topic: "Plans" },
  { id: "p60", english: "I'm looking forward to seeing you.",       meaning: "Saying you are happy and excited about meeting with someone.",          topic: "Plans" },
  { id: "p61", english: "Can we reschedule for next week?",         meaning: "Asking to move an appointment to a different time next week.",          topic: "Plans" },
  { id: "p62", english: "How about we meet at the coffee shop?",    meaning: "Suggesting the coffee shop as a place to meet.",                       topic: "Plans" },
  // TRANSPORTATION
  { id: "p63", english: "Which bus goes to downtown?",              meaning: "Asking which bus number or route will take you to the city center.",    topic: "Transport" },
  { id: "p64", english: "How long does the trip take?",             meaning: "Asking about the duration of the journey.",                            topic: "Transport" },
  { id: "p65", english: "Is this seat taken?",                      meaning: "Asking if someone is already sitting in a seat.",                      topic: "Transport" },
  { id: "p66", english: "I need to get off at the next stop.",      meaning: "Telling the driver or others you will exit at the very next stop.",     topic: "Transport" },
  { id: "p67", english: "The train is running late.",               meaning: "Saying that the train will not arrive at its scheduled time.",          topic: "Transport" },
  { id: "p68", english: "Could you drop me off here?",              meaning: "Asking a driver to stop the car so you can get out at this spot.",     topic: "Transport" },
  // SCHOOL
  { id: "p69", english: "My son forgot his lunch at home.",         meaning: "Telling the school that your child did not bring their food.",          topic: "School" },
  { id: "p70", english: "What time does school start?",             meaning: "Asking at what time the school day begins.",                           topic: "School" },
  { id: "p71", english: "Could I speak with the teacher?",          meaning: "Asking to have a conversation with your child's teacher.",              topic: "School" },
  { id: "p72", english: "School is closed on Monday.",              meaning: "There will be no school classes on Monday.",                           topic: "School" },
  { id: "p73", english: "Can you sign this form?",                  meaning: "Asking someone to write their signature on a document.",               topic: "School" },
  // BANK & SERVICES
  { id: "p74", english: "I'd like to deposit this check.",          meaning: "Telling the bank teller you want to add a check to your account.",     topic: "Bank" },
  { id: "p75", english: "What is my account balance?",              meaning: "Asking how much money you have in your bank account.",                 topic: "Bank" },
  { id: "p76", english: "I need to send money to my family.",       meaning: "Saying you want to transfer funds to relatives.",                      topic: "Bank" },
  { id: "p77", english: "I'd like to send this package.",           meaning: "Telling a postal worker you want to mail a box or envelope.",          topic: "Errands" },
  { id: "p78", english: "How long will delivery take?",             meaning: "Asking how many days until a package arrives.",                        topic: "Errands" },
  // HOME & REPAIRS
  { id: "p79", english: "The kitchen sink is leaking.",             meaning: "Telling someone the water pipe under the kitchen sink has a leak.",     topic: "Home" },
  { id: "p80", english: "When can someone come to fix this?",       meaning: "Asking when a repair person can arrive.",                              topic: "Home" },
  { id: "p81", english: "The heat is not working.",                 meaning: "Saying the heating system in your home is broken.",                    topic: "Home" },
  { id: "p82", english: "Could you recommend a good plumber?",      meaning: "Asking someone if they know a skilled person who fixes pipes.",        topic: "Home" },
  // WEATHER
  { id: "p83", english: "It's going to rain today.",                meaning: "Saying there will be rain during the day.",                            topic: "Weather" },
  { id: "p84", english: "What beautiful weather we're having!",     meaning: "Commenting positively on the nice weather outside.",                   topic: "Weather" },
  { id: "p85", english: "It's freezing cold outside!",              meaning: "Saying the temperature outside is very, very cold.",                   topic: "Weather" },
  { id: "p86", english: "Don't forget to bring an umbrella.",       meaning: "Reminding someone to take an umbrella because it might rain.",         topic: "Weather" },
  // WORK
  { id: "p87", english: "I need to finish this by Friday.",         meaning: "Saying you have a deadline on Friday for completing a task.",           topic: "Work" },
  { id: "p88", english: "Could you show me how to do this?",        meaning: "Asking someone to demonstrate or explain how to complete a task.",     topic: "Work" },
  { id: "p89", english: "I will be a few minutes late.",            meaning: "Warning someone that you will not arrive exactly on time.",             topic: "Work" },
  { id: "p90", english: "I'll get back to you as soon as possible.", meaning: "Promising to reply or respond very soon.",                            topic: "Work" },
  // EMERGENCY
  { id: "p91", english: "Please call an ambulance!",                meaning: "Urgently asking someone to call for emergency medical help.",           topic: "Emergency" },
  { id: "p92", english: "I think I left my wallet at the restaurant.", meaning: "Saying you believe you forgot your wallet at a restaurant.",        topic: "Emergency" },
  { id: "p93", english: "Can someone help me, please?",             meaning: "Calling out for anyone nearby to come and assist you.",                topic: "Emergency" },
  { id: "p94", english: "My child is missing.",                     meaning: "Telling someone urgently that you cannot find your child.",             topic: "Emergency" },
  // FEELINGS
  { id: "p95", english: "I'm really happy for you!",                meaning: "Expressing joy about something good that happened to someone else.",   topic: "Feelings" },
  { id: "p96", english: "I've been feeling a little homesick.",     meaning: "Saying you miss your home country or family.",                         topic: "Feelings" },
  { id: "p97", english: "That made me feel so much better.",        meaning: "Saying that something improved your mood or health.",                  topic: "Feelings" },
  // CELEBRATIONS
  { id: "p98", english: "Happy Birthday! Best wishes!",             meaning: "Greeting someone on their birthday.",                                  topic: "Celebrations" },
  { id: "p99", english: "Congratulations on your new job!",         meaning: "Expressing happiness for someone who just got a new job.",             topic: "Celebrations" },
  { id: "p100", english: "Wishing you all the best!",               meaning: "A warm phrase meaning you hope good things happen for someone.",       topic: "Celebrations" },
];

export const distractorWords = [
  "please", "today", "morning", "now", "here", "there", "very", "good",
  "the", "a", "my", "your", "is", "are", "can", "you", "I", "to", "and",
  "with", "for", "have", "this", "that", "want", "time", "day", "help",
  "not", "do", "we", "she", "he", "it", "at", "on", "in", "from", "will",
  "just", "some", "more", "how", "what", "when", "where", "would", "like",
];

export function phraseById(id: string): Phrase | undefined {
  return phrases.find((p) => p.id === id);
}
