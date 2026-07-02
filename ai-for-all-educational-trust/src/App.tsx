/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { IncuxLogo } from './components/IncuxLogo';

// Slides details (Futuristic city, AI students, robotics, technology, smart agritech)
const slideImages = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1920&auto=format&fit=crop"
];

const taglines = [
  "AI for Smart Cities",
  "AI for Education",
  "AI for Farmers",
  "AI for Health",
  "AI for Our Planet"
];

// AI Course Categories Metadata
const aiCategories = [
  {
    id: 'free',
    icon: '🆓',
    label: 'Free AI Course',
    color: 'ai-free',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
    brief: 'Start from zero, no coding required. Learn AI tools for everyday tasks.',
    desc: 'Complete beginner-friendly AI course. Start from zero, no coding required. Learn to use AI tools for everyday tasks, productivity, and creativity.',
    tips: ['Use ChatGPT for writing emails, messages, summaries', 'Use Google Gemini for research and Q&A', 'Use Canva AI for designing posters and graphics', 'Use Bing Image Creator for AI-generated images'],
    quiz: { q: 'Which of these is an AI chatbot?', opts: ['Microsoft Excel', 'ChatGPT', 'Google Maps', 'WhatsApp'], ans: 1 },
    ytId: 'qYNweeDHiyU',
    progress: 40,
    topics: [
      { title: 'ChatGPT — Your AI Assistant', desc: 'ChatGPT is an AI chatbot created by OpenAI that can understand and generate human-like text. You can ask it questions, get it to write emails, draft messages, summarize articles, brainstorm ideas, and even explain complex topics in simple language. It works in multiple languages including Hindi, Telugu, Tamil, and more. The best part is ChatGPT is completely free to use and available 24/7 on your phone or computer. Think of it as having a very smart friend who is always ready to help you with any writing or information task.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'Which of these is an AI chatbot?', opts: ['Microsoft Excel', 'ChatGPT', 'Google Maps', 'WhatsApp'], ans: 1 }, { q: 'Who created ChatGPT?', opts: ['Google', 'Microsoft', 'OpenAI', 'Apple'], ans: 2 }] },
      { title: 'AI for Creativity', desc: 'You do not need to be a designer or artist to create beautiful visuals. Canva AI lets you design posters, social media graphics, presentations, and banners just by describing what you want. Bing Image Creator (powered by DALL-E) can generate completely original images from your text descriptions. For example, you can type "a futuristic farm with robots" and it will create a unique image for you. These tools are revolutionizing creativity and making design accessible to everyone, regardless of skill level.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which tool can generate images from text descriptions?', opts: ['Excel', 'Bing Image Creator', 'Calculator', 'Notepad'], ans: 1 }, { q: 'What does DALL-E create?', opts: ['Spreadsheets', 'Images from text', 'Music', 'Videos'], ans: 1 }] }
    ]
  },
  {
    id: 'farmers',
    icon: '🌾',
    label: 'AI for Farmers',
    color: 'ai-farmers',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop',
    brief: 'Detect crop diseases, predict weather, check soil health with your smartphone.',
    desc: 'Use AI to detect crop diseases, predict weather, check soil health, get market prices, and increase yield using just your smartphone.',
    tips: ['Plantix app: click a photo of your crop to detect disease instantly', 'Google Lens: identify pests and get solutions in Telugu/Hindi', 'Farmer.chat: ask AI questions about farming in your local language', 'Weather apps with AI forecasting for better crop planning'],
    quiz: { q: 'Which app uses AI to detect crop diseases from photos?', opts: ['Facebook', 'Plantix', 'WhatsApp', 'YouTube'], ans: 1 },
    ytId: 'a0_lo_GDcFw',
    progress: 60,
    topics: [
      { title: 'Crop Disease Detection', desc: 'Imagine being able to diagnose your crop disease just by taking a photo with your phone. The Plantix app uses AI to instantly identify diseases, pests, and nutrient deficiencies from any photo of your crop. Google Lens can also identify pests and provides treatment solutions in Telugu, Hindi, Tamil, and many other Indian languages. These AI tools work offline in many cases and have helped millions of farmers save their crops. Early detection using AI can prevent up to 40% of crop loss, directly improving your income.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'Which app uses AI to detect crop diseases from photos?', opts: ['Facebook', 'Plantix', 'WhatsApp', 'YouTube'], ans: 1 }, { q: 'How can AI help farmers save crops?', opts: ['Early disease detection', 'Playing music', 'Watching movies', 'Chatting with friends'], ans: 0 }] },
      { title: 'Smart Farming with AI', desc: 'AI is transforming how farmers plan their entire farming cycle. Farmer.chat is an AI chatbot that answers farming questions in local languages — ask about soil preparation, fertilizer amounts, or pest control and get expert-level advice instantly. AI-powered weather apps give you hyper-local forecasts so you know exactly when to sow, irrigate, or harvest. Some apps even predict market prices for your crops, helping you decide when and where to sell for the best profit. All of this runs on a regular smartphone.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'How can AI weather apps help farmers?', opts: ['Play music', 'Forecast weather for crop planning', 'Order food', 'Take photos'], ans: 1 }, { q: 'What does Farmer.chat help with?', opts: ['Watching videos', 'Farming advice in local language', 'Playing games', 'Shopping online'], ans: 1 }] }
    ]
  },
  {
    id: 'teachers',
    icon: '🧑‍🏫',
    label: 'AI for Teachers',
    color: 'ai-teachers',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
    brief: 'Automate grading, create lesson plans, generate quizzes with AI.',
    desc: 'Automate grading, create personalized lesson plans, generate quizzes, and use AI to identify struggling students before they fall behind.',
    tips: ['ChatGPT: generate lesson plans, worksheets, and explanations instantly', 'Quizgecko: auto-generate quizzes from your textbook content', 'Gradescope: AI-assisted grading saves hours every week', 'Canva AI: create beautiful educational posters and presentations'],
    quiz: { q: 'Which AI tool can automatically create quizzes from text?', opts: ['Spotify', 'Quizgecko', 'Netflix', 'Zoom'], ans: 1 },
    ytId: 'qYNweeDHiyU',
    progress: 30,
    topics: [
      { title: 'Lesson Planning with AI', desc: 'Teachers spend hours creating lesson plans and worksheets. ChatGPT can generate complete lesson plans on any topic within seconds — just tell it the subject, grade level, and what you want to cover. It can also create worksheets, discussion questions, and even model answers. Canva AI helps you design beautiful educational posters, presentations, and visual aids for your classroom, making learning more engaging for students. These tools free up hours every week so you can focus on what matters most — teaching.', ytId: 'qYNweeDHiyU', quiz: [{ q: 'Which AI tool can automatically create quizzes from text?', opts: ['Spotify', 'Quizgecko', 'Netflix', 'Zoom'], ans: 1 }, { q: 'How can ChatGPT help teachers?', opts: ['Grade automatically', 'Generate lesson plans', 'Take attendance', 'Call parents'], ans: 1 }] },
      { title: 'AI-Powered Assessments', desc: 'Grading assignments takes up a huge portion of a teacher\'s time. Gradescope uses AI to grade assignments, tests, and even handwritten answer sheets, saving dozens of hours every week. Quizgecko can take any textbook chapter or article and instantly generate multiple quiz questions to test student understanding. These tools also provide analytics showing which students are struggling and which concepts need more attention, allowing you to personalize your teaching for better outcomes.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'What does Gradescope use AI for?', opts: ['Playing music', 'Grading assignments', 'Watching videos', 'Chatting'], ans: 1 }, { q: 'Which tool generates quizzes from textbook content?', opts: ['Spotify', 'Quizgecko', 'Netflix', 'Zoom'], ans: 1 }] }
    ]
  },
  {
    id: 'drivers',
    icon: '🚛',
    label: 'AI for Drivers',
    color: 'ai-drivers',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=600&auto=format&fit=crop',
    brief: 'Navigate smarter, earn more, stay safe with AI tools on your phone.',
    desc: 'Use AI for navigation, traffic prediction, route optimization, vehicle maintenance alerts, and earning more through smart app usage.',
    tips: ['Google Maps AI predicts traffic and saves 30% fuel and time', 'Ola/Uber AI routes maximize your earnings per shift', 'Google Translate: communicate with passengers in any language', 'AI dashcam apps detect drowsiness and alert you in real-time'],
    quiz: { q: 'How does Google Maps AI help drivers?', opts: ['Play music', 'Predict traffic & optimize routes', 'Order food', 'Take selfies'], ans: 1 },
    ytId: 'a0_lo_GDcFw',
    progress: 25,
    topics: [
      { title: 'Navigation & Route Optimization', desc: 'Google Maps uses AI to analyze real-time traffic data from millions of phones and predict the fastest route to your destination. It can save up to 30% on fuel costs by avoiding traffic jams and suggesting optimal routes. For Ola and Uber drivers, the AI system suggests where to position yourself for the next ride based on historical demand patterns, helping you maximize your daily earnings. The AI also learns your usual driving times and routes to give personalized recommendations.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'How does Google Maps AI help drivers?', opts: ['Play music', 'Predict traffic & optimize routes', 'Order food', 'Take selfies'], ans: 1 }, { q: 'How much fuel can Google Maps AI save?', opts: ['10%', 'Up to 30%', '50%', '80%'], ans: 1 }] },
      { title: 'Safety & Communication', desc: 'Safety is the number one priority for every driver. AI-powered dashcam apps can detect when you are feeling drowsy based on your eye movements and steering patterns, and alert you before an accident happens. Google Translate uses AI to translate conversations with passengers in real-time across 100+ languages, helping cab and auto drivers communicate with tourists and earn more. These AI safety tools are proven to reduce accident risk and open up new earning opportunities.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which AI feature helps detect driver drowsiness?', opts: ['Google Maps', 'AI dashcam apps', 'WhatsApp', 'Instagram'], ans: 1 }, { q: 'Which AI tool helps drivers talk to passengers in other languages?', opts: ['Google Translate', 'Google Maps', 'YouTube', 'Facebook'], ans: 0 }] }
    ]
  },
  {
    id: 'cleaners',
    icon: '🧹',
    label: 'AI for Cleaning Workers',
    color: 'ai-cleaners',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
    brief: 'Manage schedules, learn languages, access welfare schemes with AI.',
    desc: 'AI tools can help manage work schedules, communicate better, report issues through apps, and access government welfare schemes.',
    tips: ['Google Assistant: set voice reminders for work schedules', 'AI-powered apps for reporting broken infrastructure', 'Duolingo AI: learn basic English or other languages free', 'Government scheme AI chatbots: check your benefits easily'],
    quiz: { q: 'Which AI voice assistant is free to use on Android?', opts: ['Siri', 'Google Assistant', 'Alexa', 'Cortana'], ans: 1 },
    ytId: 'a0_lo_GDcFw',
    progress: 20,
    topics: [
      { title: 'Voice Assistants & Scheduling', desc: 'Google Assistant is a free AI voice assistant available on every Android phone. You can use it to set voice reminders for work schedules, create shopping lists, set alarms, and even make calls without touching your phone. AI-powered civic apps let you report broken streetlights, garbage dump issues, or water problems just by taking a photo and describing the problem. These apps automatically route your complaint to the right government department and track it until it is resolved.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'Which AI voice assistant is free on Android?', opts: ['Siri', 'Google Assistant', 'Alexa', 'Cortana'], ans: 1 }, { q: 'How can AI apps help report infrastructure issues?', opts: ['By taking a photo and auto-routing the complaint', 'By calling the police directly', 'By sending letters', 'By posting on social media'], ans: 0 }] },
      { title: 'Learning & Government Benefits', desc: 'Duolingo is a free AI-powered app that teaches you English, Hindi, or other languages through fun, game-like lessons. The AI adapts to your learning pace and focuses on areas where you need improvement. Many state and central government schemes now have AI chatbots on WhatsApp and websites that let you check your eligibility, apply for benefits, and track application status in your local language just by typing a question. No need to visit government offices or stand in long lines.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which free app uses AI to teach languages?', opts: ['Duolingo', 'Instagram', 'WhatsApp', 'YouTube'], ans: 0 }, { q: 'How can AI chatbots help with government schemes?', opts: ['By filling application forms automatically', 'By giving money directly', 'By visiting your home', 'By calling you'], ans: 0 }] }
    ]
  },
  {
    id: 'students',
    icon: '🎓',
    label: 'AI for Students',
    color: 'ai-students',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    brief: 'AI tutors, instant doubt-clearing, notes, quizzes, career guidance.',
    desc: 'Excel in your studies with AI tutors, get instant doubt-clearing, generate notes, practice with AI quizzes, and get career guidance.',
    tips: ['Khan Academy Khanmigo: AI tutor explains concepts step-by-step', 'ChatGPT: ask any doubt at 2am — patient, always available', 'Photomath/Mathway: click photo of math problem, get solution', 'Grammarly AI: improve your English writing instantly'],
    quiz: { q: 'Which AI tool helps solve math problems from photos?', opts: ['Spotify', 'Photomath', 'Twitter', 'Excel'], ans: 1 },
    ytId: 'qYNweeDHiyU',
    progress: 70,
    topics: [
      { title: 'AI Tutoring & Homework Help', desc: 'Khan Academy Khanmigo is an AI tutor that explains concepts step-by-step, just like a real teacher. It never gets tired and can explain the same thing multiple times in different ways until you understand. Photomath lets you take a photo of any math problem and gives you the solution with detailed step-by-step explanations. ChatGPT is available 24/7 to clear any doubt on any subject — from science and history to coding and literature. These tools ensure you never get stuck on a problem again.', ytId: 'qYNweeDHiyU', quiz: [{ q: 'Which AI tool solves math problems from photos?', opts: ['Spotify', 'Photomath', 'Twitter', 'Excel'], ans: 1 }, { q: 'What does Khanmigo do?', opts: ['Play music', 'Tutor students step-by-step', 'Edit photos', 'Create websites'], ans: 1 }] },
      { title: 'Writing & Research with AI', desc: 'Grammarly is an AI writing assistant that checks your English grammar, spelling, punctuation, and style in real-time. It works everywhere — in emails, documents, social media, and even WhatsApp. ChatGPT helps with research by summarizing articles, generating notes, and explaining complex topics in simple language. You can ask it to create study notes from a textbook chapter, generate practice questions, or explain a concept like photosynthesis or the French Revolution in terms a 10-year-old would understand.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which AI tool helps improve English writing?', opts: ['Grammarly', 'Spotify', 'Instagram', 'Twitter'], ans: 0 }, { q: 'How can ChatGPT help with research?', opts: ['By doing experiments', 'By summarizing articles and explaining concepts', 'By drawing diagrams', 'By conducting surveys'], ans: 1 }] }
    ]
  },
  {
    id: 'household',
    icon: '🏠',
    label: 'AI for Households',
    color: 'ai-household',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop',
    brief: 'Budgeting, health tracking, cooking, child education with AI.',
    desc: 'Make home life easier with AI for budgeting, health tracking, cooking, child education, energy saving, and household management.',
    tips: ['Google Assistant/Alexa: set timers, reminders, shopping lists', 'Yummly AI: get meal ideas based on ingredients you have', 'Mint/Money Manager: AI tracks your expenses automatically', 'AI health apps: track nutrition, sleep, and wellness daily'],
    quiz: { q: 'Which AI app helps you track household expenses?', opts: ['Instagram', 'Mint', 'TikTok', 'Snapchat'], ans: 1 },
    ytId: 'a0_lo_GDcFw',
    progress: 35,
    topics: [
      { title: 'Smart Home Management', desc: 'Google Assistant and Alexa are AI voice assistants that can control your home with simple voice commands. Set timers while cooking, add items to your shopping list, set reminders for medicine or bills, control lights and fans, and even play music — all hands-free. Yummly AI helps solve the daily "what to cook" problem by suggesting recipes based on ingredients you already have at home. Just tell it what is in your kitchen and it will find the perfect meal ideas, saving time and reducing food waste.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'Which AI app suggests meals based on ingredients you have?', opts: ['YouTube', 'Yummly', 'Netflix', 'Instagram'], ans: 1 }, { q: 'How can voice assistants help at home?', opts: ['By cleaning the house', 'By setting timers and reminders', 'By driving the car', 'By doing laundry'], ans: 1 }] },
      { title: 'Finance & Health Tracking', desc: 'Mint and Money Manager apps use AI to automatically track your income and expenses. They connect to your bank account, categorize every transaction (groceries, rent, utilities, entertainment), and show you where your money goes each month. This helps you save more and spend wisely. AI health apps like HealthifyMe track your nutrition, sleep patterns, step count, and daily wellness. They give personalized recommendations to improve your health and can even remind you to drink water, take walks, or do breathing exercises.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which AI app tracks household expenses?', opts: ['Instagram', 'Mint', 'TikTok', 'Snapchat'], ans: 1 }, { q: 'What does AI health apps track?', opts: ['Only steps', 'Nutrition, sleep, and wellness', 'Only weight', 'Only heart rate'], ans: 1 }] }
    ]
  },
  {
    id: 'msme',
    icon: '🏪',
    label: 'AI for MSMEs',
    color: 'ai-msme',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=600&auto=format&fit=crop',
    brief: 'Inventory, customer chatbots, marketing, accounting with AI.',
    desc: 'Grow your small business with AI for inventory management, customer service chatbots, digital marketing, accounting, and finding new markets.',
    tips: ['ChatGPT: write product descriptions, ads, and emails in minutes', 'Meta AI: run targeted Facebook/Instagram ads with AI', 'Tally with AI: automate GST calculations and invoicing', 'WhatsApp Business AI: auto-reply to customer queries 24/7'],
    quiz: { q: 'Which platform uses AI to help run targeted ads?', opts: ['Meta (Facebook/Instagram)', 'WhatsApp only', 'SMS', 'Radio'], ans: 0 },
    ytId: 'qYNweeDHiyU',
    progress: 45,
    topics: [
      { title: 'Marketing & Content with AI', desc: 'Small business owners often struggle with writing product descriptions, ads, and marketing emails. ChatGPT can write all of these for you in seconds — just describe your product and target audience. Meta AI (Facebook and Instagram) lets you run targeted ads that automatically show your products to people most likely to buy them. The AI analyzes user behavior, interests, and location to find your ideal customers. You can start with as little as Rs. 100 per day and reach thousands of potential customers in your area.', ytId: 'qYNweeDHiyU', quiz: [{ q: 'Which platform runs targeted AI ads?', opts: ['Meta (Facebook/Instagram)', 'WhatsApp only', 'SMS', 'Radio'], ans: 0 }, { q: 'How can ChatGPT help small businesses?', opts: ['By writing product descriptions and ads', 'By delivering products', 'By managing employees', 'By renting space'], ans: 0 }] },
      { title: 'Business Operations with AI', desc: 'Tally with AI automation handles GST calculations, invoicing, and inventory tracking automatically — saving hours of manual work and reducing errors. WhatsApp Business AI allows you to set up auto-reply messages for common customer queries like "What is your price?", "Are you open today?", or "Do you deliver?" The AI responds instantly, 24/7, so you never miss a customer even when you are asleep or busy. These tools are affordable and designed specifically for small businesses with limited budgets.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'How can AI help small business operations?', opts: ['Auto-reply to customers and automate accounting', 'Only for big companies', 'Too expensive', 'Only for tech companies'], ans: 0 }, { q: 'What does Tally with AI automate?', opts: ['Music playlists', 'GST calculations and invoicing', 'Video editing', 'Game development'], ans: 1 }] }
    ]
  },
  {
    id: 'startups',
    icon: '🚀',
    label: 'AI for Startups',
    color: 'ai-startups',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    brief: 'Build faster, market research, pitch decks, analytics with AI.',
    desc: 'Build faster, smarter products with AI. Use AI for market research, MVP development, customer analytics, pitching, and fundraising.',
    tips: ['GPT-4 API: add AI features to your product in hours not months', 'Notion AI: plan your startup strategy and product roadmap', 'Beautiful.ai: create investor pitch decks with AI design', 'Stripe + AI: automate payment analytics and churn prediction'],
    quiz: { q: 'What does MVP stand for in startup context?', opts: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Main Venture Plan'], ans: 1 },
    ytId: 'qYNweeDHiyU',
    progress: 50,
    topics: [
      { title: 'Building AI-Powered Products', desc: 'You do not need a team of AI experts to add AI features to your product. The GPT-4 API from OpenAI lets you add chat, text generation, summarization, and language understanding features to your app with just a few lines of code. Stripe with AI integration automates payment processing, detects fraudulent transactions, and predicts which customers are likely to stop using your product (churn prediction) so you can take action early. These tools let startups build enterprise-grade AI features in hours, not months.', ytId: 'qYNweeDHiyU', quiz: [{ q: 'What does MVP stand for?', opts: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Main Venture Plan'], ans: 1 }, { q: 'What does Stripe AI help with?', opts: ['Payment analytics and churn prediction', 'Social media marketing', 'Employee hiring', 'Office management'], ans: 0 }] },
      { title: 'Strategy & Fundraising', desc: 'Notion AI is an all-in-one workspace that helps you plan your startup strategy, create product roadmaps, write business plans, and collaborate with your team. It can even summarize meetings and generate action items automatically. When it is time to raise money from investors, Beautiful.ai creates stunning investor pitch decks with AI-powered design. You just add your content and the AI arranges it beautifully. First impressions matter and a professional pitch deck can make the difference between getting funded or not.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which AI tool helps create investor pitch decks?', opts: ['Excel', 'Beautiful.ai', 'Paint', 'Calculator'], ans: 1 }, { q: 'How does Notion AI help startups?', opts: ['By coding the product', 'By planning strategy and roadmaps', 'By hiring employees', 'By managing finances'], ans: 1 }] }
    ]
  },
  {
    id: 'kids',
    icon: '👶',
    label: 'AI for Kids',
    color: 'ai-kids',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop',
    brief: 'Fun coding, AI training games, creative projects for children 6-16.',
    desc: 'Fun, safe, and creative AI tools for children. Learn coding, create art, tell stories, do science projects, and play educational games powered by AI.',
    tips: ['Scratch + AI: build your own AI-powered games visually', 'Google Teachable Machine: train your own AI with photos', 'ChatGPT: write stories, poems, and creative adventures', 'Canva for Education: design AI-powered visual projects'],
    quiz: { q: 'Which tool lets kids create AI-powered games visually?', opts: ['Fortnite', 'Scratch', 'PUBG', 'Call of Duty'], ans: 1 },
    ytId: 'a0_lo_GDcFw',
    progress: 15,
    topics: [
      { title: 'Creative Coding & Games', desc: 'Scratch is a visual programming language where kids can create their own games, animations, and interactive stories by snapping blocks together like puzzle pieces. With AI extensions, kids can add voice recognition, image detection, and translation features to their creations. Google Teachable Machine is a web-based tool where kids can train their own AI models using just photos from their webcam. For example, they can train it to recognize their face, their pet, or different hand gestures. It makes the concept of AI tangible and fun.', ytId: 'a0_lo_GDcFw', quiz: [{ q: 'Which tool lets kids create AI-powered games visually?', opts: ['Fortnite', 'Scratch', 'PUBG', 'Call of Duty'], ans: 1 }, { q: 'What can kids do with Google Teachable Machine?', opts: ['Train their own AI with photos', 'Play online games', 'Chat with friends', 'Watch videos'], ans: 0 }] },
      { title: 'AI for Stories & Art', desc: 'ChatGPT can be a creative companion for children. They can ask it to write stories about their favorite characters, create poems about animals, or invent new adventures. Parents can supervise and guide the interaction to ensure it is educational and safe. Canva for Education provides a safe platform where kids can design posters, book covers, science project presentations, and art projects using AI-powered design tools. These tools help children express their creativity while learning about the capabilities and limitations of AI in a guided environment.', ytId: '0yCJMt9Mx9c', quiz: [{ q: 'Which AI tool can help kids write stories?', opts: ['ChatGPT', 'Calculator', 'Alarm clock', 'TV remote'], ans: 0 }, { q: 'What is Canva for Education?', opts: ['A messaging app', 'A design platform for students', 'A video game', 'A music app'], ans: 1 }] }
    ]
  }
];

// Standalone Quiz Questions for Student Portal
const quizBank = [
  { q: 'What does AI stand for?', opts: ['Automatic Internet', 'Artificial Intelligence', 'Advanced Information', 'Automated Interface'], ans: 1 },
  { q: 'Which company made ChatGPT?', opts: ['Google', 'Meta', 'OpenAI', 'Microsoft'], ans: 2 },
  { q: 'What is machine learning?', opts: ['Teaching humans machines', 'AI learning from data', 'Learning to type fast', 'Fixing computers'], ans: 1 },
  { q: 'Which of these is an AI image generator?', opts: ['Excel', 'Photoshop', 'Midjourney', 'Notepad'], ans: 2 },
  { q: 'What is a neural network inspired by?', opts: ['Computer chips', 'Human brain', 'Internet cables', 'Solar panels'], ans: 1 }
];

export default function App() {

  useEffect(() => {
    // ===== BIND GLOBALS ON WINDOW TO KEEPS INLINE RE-DIRECTS WORKING EXACTLY SAME =====
    const w = window as any;

    let currentUser: any = null;
    let currentSlide = 0;
    const totalSlides = 5;
    const videoLinks: Record<string, string> = {};
    aiCategories.forEach(c => {
      videoLinks[c.id] = 'https://www.youtube.com/embed/' + c.ytId;
    });

    // Robust Spline Robot Scene Loader (Native Vite import compilation)
    const loadSpline = async () => {
      const canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
      if (!canvas) return;
      if (canvas.getAttribute('data-spline-initialized') === 'true') return;
      canvas.setAttribute('data-spline-initialized', 'true');
      
      try {
        const { Application } = await import('@splinetool/runtime');
        const appInstance = new Application(canvas);
        appInstance.load('https://prod.spline.design/cfZFmmr0Xya02asA/scene.splinecode')
            .then(() => {
              // Hide any watermarks safely
              setTimeout(() => {
                const wm = document.querySelectorAll('[class*="logo"],[id*="logo"],[data-spline]');
                wm.forEach(el => {
                  if (el.tagName !== 'CANVAS' && el instanceof HTMLElement) {
                    // Do NOT hide our header/footer logo of the educational trust
                    if (!el.closest('header') && !el.closest('footer')) {
                      el.style.display = 'none';
                    }
                  }
                });
                
                const c = document.getElementById('canvas3d');
                if (c && c.parentElement) {
                  Array.from(c.parentElement.children).forEach(ch => {
                    if (ch.id !== 'canvas3d' && ch.tagName !== 'CANVAS' && ch instanceof HTMLElement) {
                      ch.style.display = 'none';
                    }
                  });
                }
              }, 3000);
            })
            .catch(err => {
              console.warn("Spline load promise error", err);
            });
        } catch (err) {
          console.warn("Spline application load caught error", err);
        }
    };

    loadSpline();
    w.reinitSplineRobotOnDemand = loadSpline;

    let checkAttempts = 0;
    const checkInterval = setInterval(() => {
      const canvas = document.getElementById('canvas3d');
      if (canvas && canvas.getAttribute('data-spline-initialized') !== 'true') {
        loadSpline();
        clearInterval(checkInterval);
      }
      if (++checkAttempts > 30) {
        clearInterval(checkInterval);
      }
    }, 500);

    // Floating Particles Setup (Identical metrics)
    const container = document.getElementById('particles');
    if (container) {
      container.innerHTML = '';
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random() * 100}%;--dur:${6 + Math.random() * 12}s;--x:${-30 + Math.random() * 60}px;--dx:${-20 + Math.random() * 40}px;--op:${0.2 + Math.random() * 0.5};animation-delay:-${Math.random() * 15}s;`;
        container.appendChild(p);
      }
    }

    // Type tagline animation
    const taglineEl = document.getElementById('tagline-text');
    let typingInterval: ReturnType<typeof setInterval> | null = null;
    const typeTagline = (text: string) => {
      if (!taglineEl) return;
      if (typingInterval) clearInterval(typingInterval);
      taglineEl.textContent = '';
      let idx = 0;
      typingInterval = setInterval(() => {
        if (idx < text.length) {
          taglineEl.textContent += text[idx++];
        } else {
          clearInterval(typingInterval!);
          typingInterval = null;
        }
      }, 40);
    };

    // Slideshow Dots dynamic population
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    if (dotsContainer && slides.length > 0) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.onclick = () => w.goToSlide(i);
        dotsContainer.appendChild(d);
      });
    }

    w.goToSlide = (n: number) => {
      const activeSlides = document.querySelectorAll('.slide');
      const activeDots = document.getElementById('slider-dots')?.children;
      if (activeSlides.length > 0) {
        activeSlides[currentSlide]?.classList.remove('active');
        if (activeDots && activeDots[currentSlide]) {
          activeDots[currentSlide].classList.remove('active');
        }
        currentSlide = n;
        activeSlides[currentSlide]?.classList.add('active');
        if (activeDots && activeDots[currentSlide]) {
          activeDots[currentSlide].classList.add('active');
        }
        typeTagline(taglines[currentSlide % taglines.length]);
      }
    };

    // Auto rotate slides
    const sliderInterval = setInterval(() => {
      w.goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
    const initTimeout = setTimeout(() => typeTagline(taglines[0]), 500);

    // Dynamic numeric animations
    const animateCounter = (el: HTMLElement | null, target: number, suffix = '') => {
      if (!el) return;
      let current = 0;
      const step = target / 60;
      const t = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(t);
        }
        el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
      }, 30);
    };



    // Toggle about details (mission/vision/programs)
    w.toggleAboutDetail = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const isVisible = el.style.display !== 'none';
      ['about-mission', 'about-vision', 'about-programs'].forEach(sid => {
        const s = document.getElementById(sid);
        if (s) s.style.display = 'none';
      });
      if (!isVisible) el.style.display = 'block';
    };

    // Toggle compact values
    w.toggleValues = () => {
      const list = document.getElementById('values-list');
      const arrow = document.getElementById('values-arrow');
      if (list) {
        const hidden = list.style.display === 'none';
        list.style.display = hidden ? 'flex' : 'none';
        if (arrow) arrow.textContent = hidden ? '▲' : '▼';
      }
    };

    // Nav Switcher
    w.showPage = (id: string) => {
      if (id === 'about') {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const homePage = document.getElementById('home');
        if (homePage) homePage.classList.add('active');
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        const navElements = document.querySelectorAll('nav a');
        if (navElements[1]) navElements[1].classList.add('active');
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const footerHide = ['vol-portal', 'admin-portal'];
      const targetPage = document.getElementById(id);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const navElements = document.querySelectorAll('nav a');
      const navMap: Record<string, number> = { home: 0, about: 1, ai4all: 2, programs: 3, gallery: 4, volunteer: 5 };
      if (navMap[id] !== undefined && navElements[navMap[id]]) {
        navElements[navMap[id]].classList.add('active');
      }
      const footer = document.getElementById('main-footer');
      if (footer) {
        footer.style.display = footerHide.includes(id) ? 'none' : 'block';
      }
      if (id === 'home') {
        setTimeout(() => {
          loadSpline();
        }, 100);
      }
      window.scrollTo(0, 0);
    };

    // Logins
    w.handleLoginBtn = () => {
      if (currentUser) {
        currentUser = null;
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.textContent = '🔐 Login';
        const loggedUserEl = document.getElementById('logged-user');
        if (loggedUserEl) loggedUserEl.style.display = 'none';
        w.showPage('home');
      } else {
        w.openModal();
      }
    };

    w.openModal = () => {
      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.add('active');
    };

    w.closeModal = () => {
      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.remove('active');
      const success = document.getElementById('modal-success');
      if (success) success.style.display = 'none';
      document.querySelectorAll('.modal-form').forEach(f => {
        (f as HTMLElement).style.display = '';
        f.classList.remove('active');
      });
      const volTab = document.getElementById('volunteer-tab');
      if (volTab) volTab.classList.add('active');
      const tabElements = document.querySelectorAll('.modal-tab');
      tabElements.forEach((t, i) => {
        if (i === 0) t.classList.add('active');
        else t.classList.remove('active');
      });
    };

    w.switchTab = (id: string, e: Event) => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      document.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));
      const targetForm = document.getElementById(id);
      if (targetForm) targetForm.classList.add('active');
    };

    w.loginUser = (role: string) => {
      const success = document.getElementById('modal-success');
      document.querySelectorAll('.modal-form').forEach(f => {
        (f as HTMLElement).style.display = 'none';
      });
      if (success) success.style.display = 'block';

      let name = 'User';
      if (role === 'volunteer') {
        const val = (document.getElementById('vol-login-email') as HTMLInputElement)?.value;
        name = val ? val.split('@')[0] : 'Volunteer';
      } else {
        name = 'Admin';
      }

      const successMsg = document.getElementById('success-msg');
      if (successMsg) successMsg.textContent = `Welcome ${name}! Redirecting to your portal...`;

      currentUser = { role, name };
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) loginBtn.textContent = '🚪 Logout';
      const loggedUserEl = document.getElementById('logged-user');
      if (loggedUserEl) {
        loggedUserEl.textContent = '👤 ' + name;
        loggedUserEl.style.display = 'inline';
      }

      setTimeout(() => {
        w.closeModal();
        if (role === 'volunteer') {
          const pName = document.getElementById('portal-name');
          const pFullName = document.getElementById('portal-fullname');
          const pAvatar = document.getElementById('portal-avatar');
          if (pName) pName.textContent = name;
          if (pFullName) pFullName.textContent = name;
          if (pAvatar) pAvatar.textContent = name[0].toUpperCase();
          w.showPage('vol-portal');
        } else {
          w.showPage('admin-portal');
        }
      }, 1500);
    };

    w.registerVolunteer = () => {
      const fname = (document.getElementById('vol-fname') as HTMLInputElement)?.value;
      const email = (document.getElementById('vol-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('vol-phone') as HTMLInputElement)?.value || '';
      const state = (document.getElementById('vol-state') as HTMLInputElement)?.value || '';
      const why = (document.getElementById('vol-why') as HTMLTextAreaElement)?.value || '';
      if (!fname || !email) {
        w.showToast('⚠️ Please fill in required fields');
        return;
      }
      // Store in localStorage
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      volunteers.push({ name: fname, email, phone, state, why, date: new Date().toLocaleDateString('en-IN') });
      localStorage.setItem('volunteers', JSON.stringify(volunteers));
      w.showToast('✅ Registered successfully! Please login to access your portal.');
      setTimeout(() => w.openModal(), 2000);
    };

    // Portal navigations
    w.showPortalSection = (id: string, e: Event) => {
      document.querySelectorAll('#vol-portal .portal-section').forEach(s => s.classList.remove('active'));
      const sect = document.getElementById(id);
      if (sect) sect.classList.add('active');
      document.querySelectorAll('#vol-portal .portal-nav-btn').forEach(b => b.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      if (id === 'st-quiz') w.buildStudentQuiz();
    };

    w.showAdminSection = (id: string, e: Event) => {
      document.querySelectorAll('#admin-portal .portal-section').forEach(s => s.classList.remove('active'));
      const sect = document.getElementById(id);
      if (sect) sect.classList.add('active');
      document.querySelectorAll('#admin-portal .portal-nav-btn').forEach(b => b.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      if (id === 'admin-content') w.buildContentEditor();
      if (id === 'admin-analytics') w.buildAnalytics();
      if (id === 'admin-registrations') w.loadEventRegistrations();
    };

    w.toggleDept = (el: HTMLElement) => {
      el.classList.toggle('selected');
    };

    w.registerEvent = (btn: HTMLElement) => {
      if (btn.classList.contains('registered')) {
        btn.textContent = '✅ Registered';
        return;
      }
      btn.classList.add('registered');
      btn.textContent = '✅ Registered!';
      // Store registration
      const card = btn.closest('.event-card, .h-event-card');
      const titleEl = card?.querySelector('.event-title');
      const eventName = titleEl?.textContent || 'Unknown Event';
      const volName = (document.getElementById('portal-fullname')?.textContent) || (document.getElementById('vol-name') as HTMLInputElement)?.value || 'Anonymous';
      const volEmail = (document.getElementById('portal-email')?.textContent) || (document.getElementById('vol-email') as HTMLInputElement)?.value || 'unknown@email.com';
      const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      registrations.push({ event: eventName, name: volName, email: volEmail, date: new Date().toLocaleDateString('en-IN') });
      localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
      w.showToast('🎉 You are registered for this event!');
    };

    w.loadEventRegistrations = () => {
      const tbody = document.getElementById('admin-registrations-body');
      if (!tbody) return;
      const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem">No registrations yet.</td></tr>';
        return;
      }
      tbody.innerHTML = registrations.map((r: any, i: number) =>
        `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.event}</td><td>${r.date}</td></tr>`
      ).join('');
    };

    w.markTaskDone = (btn: HTMLButtonElement) => {
      const card = btn.closest('.task-card') as HTMLElement;
      if (card) card.style.opacity = '0.5';
      btn.textContent = '✅ Done!';
      btn.disabled = true;
      w.showToast('✅ Task marked as complete!');
    };

    w.toggleAttend = (btn: HTMLElement) => {
      if (btn.classList.contains('attend-present')) {
        btn.classList.remove('attend-present');
        btn.classList.add('attend-absent');
        btn.textContent = 'Absent';
      } else {
        btn.classList.remove('attend-absent');
        btn.classList.add('attend-present');
        btn.textContent = 'Present';
      }
    };

    w.createEvent = () => {
      const title = (document.getElementById('ev-title') as HTMLInputElement)?.value;
      const date = (document.getElementById('ev-date') as HTMLInputElement)?.value;
      const location = (document.getElementById('ev-location') as HTMLInputElement)?.value;
      const slots = (document.getElementById('ev-slots') as HTMLInputElement)?.value;
      if (!title) {
        w.showToast('⚠️ Please enter event title');
        return;
      }
      const tbody = document.getElementById('admin-events-table')?.querySelector('tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${title}</td><td>${date || 'TBD'}</td><td>${location || 'TBD'}</td><td>0/${slots || 50}</td><td><span class="badge badge-blue">Open</span></td><td><button class="btn-small btn-danger-small" onclick="window.deleteEventRow(this)">Delete</button></td>`;
        tbody.appendChild(tr);
      }
      const evList = document.getElementById('vol-events-list');
      if (evList) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `<div class="event-date-bar"><span>📅 ${date || 'TBD'}</span><span>${location || 'TBD'}</span></div><div class="event-body"><div class="event-title">${title}</div><div class="event-dept">Dept: <span>All Departments</span></div><div class="event-slots">⚠️ ${slots || 50} slots available</div><button class="btn-register-event" onclick="window.registerEvent(this)">Register for This Event</button></div>`;
        evList.appendChild(card);
      }
      w.showToast(`✅ Event "${title}" created!`);
      const tInput = document.getElementById('ev-title') as HTMLInputElement;
      if (tInput) tInput.value = '';
    };

    w.deleteEventRow = (btn: HTMLElement) => {
      const tr = btn.closest('tr');
      if (tr) tr.remove();
      w.showToast('🗑️ Event deleted.');
    };

    w.assignTask = () => {
      const vol = (document.getElementById('assign-vol') as HTMLSelectElement)?.value;
      const title = (document.getElementById('task-title') as HTMLInputElement)?.value;
      const desc = (document.getElementById('task-desc') as HTMLTextAreaElement)?.value;
      const due = (document.getElementById('task-due') as HTMLInputElement)?.value;
      if (!title) {
        w.showToast('⚠️ Enter task title');
        return;
      }
      const list = document.getElementById('assigned-tasks-list');
      if (list) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `<div class="task-title">${vol} → ${title}</div><div class="task-desc">Due: ${due || 'TBD'} | ${desc || ''} | Status: Pending</div>`;
        list.prepend(card);
      }
      const tInput = document.getElementById('task-title') as HTMLInputElement;
      const dInput = document.getElementById('task-desc') as HTMLTextAreaElement;
      if (tInput) tInput.value = '';
      if (dInput) dInput.value = '';
      w.showToast(`✅ Task assigned to ${vol}!`);
    };

    w.makeDonation = () => {
      const amount = (document.getElementById('donation-amount') as HTMLInputElement)?.value;
      const fund = (document.getElementById('donation-fund') as HTMLSelectElement)?.value;
      if (!amount || Number(amount) < 1) {
        w.showToast('⚠️ Please enter a valid amount');
        return;
      }
      const history = document.querySelector('.donation-history');
      if (history) {
        const item = document.createElement('div');
        item.className = 'donation-item';
        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        item.innerHTML = `<div><div style="font-weight:700;font-size:0.9rem;">${fund}</div><div style="font-size:0.78rem;color:var(--text-muted);">${today}</div></div><div class="donation-amount">₹${amount}</div>`;
        history.prepend(item);
      }
      const amountInput = document.getElementById('donation-amount') as HTMLInputElement;
      if (amountInput) amountInput.value = '';
      w.showToast(`💝 Thank you for donating ₹${amount}!`);
    };

    // AI4ALL Builder — image cards that navigate to topic detail page
    w.buildAI4All = () => {
      const container = document.getElementById('ai-categories-container');
      if (!container) return;
      container.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'ai-card ai-card-link';
        card.onclick = () => w.showAITopicPage(cat.id);
        card.innerHTML = `
          <div class="ai-card-img" style="background-image:url('${cat.image}')"></div>
          <div class="ai-card-body">
            <div class="ai-card-title">${cat.label}</div>
            <div class="ai-card-brief">${cat.brief}</div>
          </div>`;
        container.appendChild(card);
      });
    };

    // Topic detail page navigation
    w.showAITopicPage = (id: string) => {
      const cat = aiCategories.find(c => c.id === id);
      if (!cat) return;
      const titleEl = document.getElementById('topic-category-name');
      if (titleEl) titleEl.textContent = cat.label;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const topicPage = document.getElementById('ai-topic-detail');
      if (topicPage) topicPage.classList.add('active');
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      document.getElementById('main-footer')?.style.setProperty('display', 'block');
      window.scrollTo(0, 0);
      w.buildAITopicContent(id);
    };

    w.backToAI4All = () => {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const aiPage = document.getElementById('ai4all');
      if (aiPage) aiPage.classList.add('active');
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const navEls = document.querySelectorAll('nav a');
      if (navEls[2]) navEls[2].classList.add('active');
      document.getElementById('main-footer')?.style.setProperty('display', 'block');
      window.scrollTo(0, 0);
    };

    w.buildAITopicContent = (id: string) => {
      const cat = aiCategories.find(c => c.id === id);
      const container = document.getElementById('ai-topic-content');
      if (!cat || !container) return;
      container.innerHTML = '';
      cat.topics.forEach((topic, idx) => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic-card';
        topicDiv.innerHTML = `
          <div class="topic-title">${topic.title}</div>
          <div class="topic-desc">${topic.desc}</div>
          <div class="ai-video-wrap">
            <iframe src="https://www.youtube.com/embed/${topic.ytId}" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="topic-quiz-section">
            <button class="btn-quiz" onclick="window.openTopicQuiz('${cat.id}',${idx})">Take Quiz</button>
            <div class="quiz-content" id="tq-${cat.id}-${idx}" style="display:none"></div>
          </div>`;
        container.appendChild(topicDiv);
      });
    };

    w.openTopicQuiz = (catId: string, idx: number) => {
      const cat = aiCategories.find(c => c.id === catId);
      const content = document.getElementById(`tq-${catId}-${idx}`);
      const btn = content?.closest('.topic-quiz-section')?.querySelector('.btn-quiz') as HTMLElement;
      if (!content || !cat || !cat.topics[idx]) return;
      const topic = cat.topics[idx];
      content.innerHTML = topic.quiz.map((q, qi) => `
        <div class="quiz-q">Q${qi+1}. ${q.q}</div>
        <div class="quiz-options">
          ${q.opts.map((o, oi) => `<button class="quiz-opt" onclick="window.answerTopicQuiz(this,${qi},${oi},${q.ans})">${o}</button>`).join('')}
        </div>
      `).join('');
      content.style.display = 'block';
      if (btn) btn.style.display = 'none';
    };

    w.answerTopicQuiz = (btn: HTMLButtonElement, qIdx: number, chosen: number, correct: number) => {
      const parentQ = btn.closest('.quiz-options');
      if (!parentQ) return;
      const opts = parentQ.querySelectorAll('.quiz-opt');
      opts.forEach(o => ((o as HTMLButtonElement).disabled = true));
      opts[correct]?.classList.add('correct');
      if (chosen !== correct) btn.classList.add('wrong');
      const feedback = document.createElement('div');
      feedback.style.cssText = 'margin-top:0.8rem;font-size:0.85rem;font-weight:600;';
      feedback.textContent = chosen === correct ? 'Correct!' : 'Incorrect. The right answer is: ' + (opts[correct]?.textContent || '');
      feedback.style.color = chosen === correct ? 'var(--success)' : 'var(--secondary)';
      if (!parentQ.querySelector('.quiz-feedback')) {
        parentQ.appendChild(feedback);
      }
    };

    w.buildAI4All();

    // Content Editor
    w.buildContentEditor = () => {
      const container = document.getElementById('content-editor-list');
      if (!container) return;
      container.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'editor-card';
        card.innerHTML = `
          <h3>${cat.label}</h3>
          <div class="form-group"><label>Description Text</label>
            <textarea rows="2" id="edit-desc-${cat.id}" style="width:100%;padding:0.7rem;background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-family:'Inter',sans-serif;outline:none;resize:vertical;">${cat.desc}</textarea>
          </div>
          <div class="video-editor-row">
            <input type="text" id="edit-yt-${cat.id}" placeholder="YouTube embed URL" value="${videoLinks[cat.id]}">
            <button class="btn-small" onclick="window.updateContent('${cat.id}')">💾 Save</button>
          </div>`;
        container.appendChild(card);
      });
    };

    w.updateContent = (id: string) => {
      const newDesc = (document.getElementById('edit-desc-' + id) as HTMLTextAreaElement)?.value;
      const newYt = (document.getElementById('edit-yt-' + id) as HTMLInputElement)?.value;
      videoLinks[id] = newYt;
      const descEl = document.getElementById('desc-' + id);
      const vidEl = document.getElementById('vid-' + id) as HTMLIFrameElement;
      if (descEl) descEl.textContent = newDesc;
      if (vidEl) vidEl.src = newYt;
      w.showToast('✅ Content updated for ' + id + '!');
    };

    // Analytics Build
    w.buildAnalytics = () => {
      const grid = document.getElementById('analytics-grid');
      if (!grid) return;
      grid.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'analytics-card';
        card.innerHTML = `<h4>${cat.label}</h4>
          <div class="mini-label"><span>Learners</span><span>${Math.floor(500 + Math.random() * 5000)}</span></div>
          <div class="mini-bar"><div class="mini-fill" style="width:${cat.progress}%"></div></div>
          <div class="mini-label"><span>Avg Completion</span><span style="color:var(--primary)">${cat.progress}%</span></div>`;
        grid.appendChild(card);
      });
    };

    // Student Quiz Build
    let currentQ = 0;
    let quizScore = 0;

    w.buildStudentQuiz = () => {
      const c = document.getElementById('quiz-container');
      if (!c) return;
      if (currentQ >= quizBank.length) {
        c.innerHTML = `<div style="text-align:center;padding:2rem"><div style="font-size:3rem">🎉</div><h3 style="color:var(--success);font-family:'Space Grotesk',sans-serif;margin:1rem 0;font-weight:700;">Quiz Complete!</h3><p style="color:var(--text-muted)">You scored ${quizScore}/${quizBank.length}</p><button class="btn-submit" onclick="window.resetQuiz()" style="margin-top:1rem;max-width:200px;">🔄 Try Again</button></div>`;
        return;
      }
      const q = quizBank[currentQ];
      if (q) {
        c.innerHTML = `<div class="big-quiz-q">Q${currentQ + 1}. ${q.q}</div>
          <div class="big-quiz-opts">${q.opts.map((o, i) => `<button class="big-quiz-opt" onclick="window.answerStudentQuiz(this,${i},${q.ans})">${o}</button>`).join('')}</div>
          <div id="quiz-fb" class="quiz-feedback" style="display:none"></div>`;
      }
    };

    w.resetQuiz = () => {
      currentQ = 0;
      quizScore = 0;
      const sDisp = document.getElementById('quiz-score-display');
      if (sDisp) sDisp.textContent = 'Score: 0';
      w.buildStudentQuiz();
    };

    w.answerStudentQuiz = (btn: HTMLButtonElement, chosen: number, correct: number) => {
      const opts = btn.closest('.big-quiz-opts')?.querySelectorAll('.big-quiz-opt');
      if (opts) {
        opts.forEach(o => ((o as HTMLButtonElement).disabled = true));
        opts[correct]?.classList.add('correct');
      }
      const fb = document.getElementById('quiz-fb');
      if (fb) {
        if (chosen === correct) {
          btn.classList.add('correct');
          quizScore++;
          const scoreDisp = document.getElementById('quiz-score-display');
          if (scoreDisp) scoreDisp.textContent = 'Score: ' + quizScore;
          fb.className = 'quiz-feedback correct';
          fb.textContent = '🎉 Correct! Well done!';
        } else {
          btn.classList.add('wrong');
          fb.className = 'quiz-feedback wrong';
          fb.textContent = '❌ Incorrect. The right answer is: ' + quizBank[currentQ].opts[correct];
        }
        fb.style.display = 'block';
      }
      currentQ++;
      setTimeout(() => w.buildStudentQuiz(), 1800);
    };

    // Toasts
    w.showToast = (msg: string) => {
      const t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = `<span>${msg}</span>`;
      document.body.appendChild(t);
      setTimeout(() => {
        t.style.animation = 'slideInToast 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse';
        setTimeout(() => t.remove(), 400);
      }, 3000);
    };

    // Periodic check to hide Spline watermarks safely
    const labelInterval = setInterval(() => {
      document.querySelectorAll('a[href*="spline"], [class*="watermark"], [id*="watermark"]').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
    }, 1000);

    // Scroll listener for transparent & sticky header behavior
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to establish correct state
    handleScroll();

    // Chat functionality
    w.toggleChat = () => {
      const modal = document.getElementById('chat-modal');
      if (modal) {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
          setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
        }
      }
    };

    w.sendChatMessage = () => {
      const input = document.getElementById('chat-input') as HTMLInputElement;
      if (!input || !input.value.trim()) return;
      const msg = input.value.trim();
      input.value = '';
      const msgs = document.getElementById('chat-messages');
      if (!msgs) return;

      // Add user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg user';
      userDiv.innerHTML = `<div class="chat-msg-content">${msg}</div>`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;

      // Generate response
      setTimeout(() => {
        const response = getChatResponse(msg);
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot';
        botDiv.innerHTML = `<div class="chat-msg-content">${response}</div>`;
        msgs.appendChild(botDiv);
        msgs.scrollTop = msgs.scrollHeight;
      }, 600);
    };

    const getChatResponse = (msg: string): string => {
      const lower = msg.toLowerCase();

      // Greetings
      if (/^(hi|hello|hey|hlo|good\s*(morning|afternoon|evening)|yo|sup|namaste|vanakam|🙏|namaskar)/.test(lower)) {
        return 'Hello! 👋 Welcome to AI For All Educational Trust. I\'m here to help you with any questions. Ask me about our programs, how to volunteer, login help, or anything else!';
      }

      // Who are you / about
      if (/who\s*(are|is)\s*(you|this)|about|what\s*(is|are)\s*(this|you)|tell\s*me\s*about/.test(lower) && !/program/.test(lower) && !/mission/.test(lower)) {
        return 'I\'m the AI Assistant for <b>AI For All Educational Trust</b>. We\'re a non-profit organization on a mission to make AI knowledge accessible to every Indian citizen. We operate across 22 states with 5000+ volunteers!';
      }

      // Mission
      if (/mission/.test(lower)) {
        return 'Our mission is to make AI knowledge <b>accessible, affordable, and actionable</b> for every Indian citizen regardless of their education, age, or economic background. 🌟';
      }

      // Vision
      if (/vision/.test(lower)) {
        return 'Our vision is to create a future where every Indian has the knowledge and tools to harness AI for personal and community growth. 🚀';
      }

      // Programs
      if (/program/.test(lower) || /courses?/.test(lower) || /course/.test(lower) || /what\s*(do|are)\s*we\s*(do|offer)/.test(lower)) {
        return 'We offer <b>6 key programs</b>:<br>• 🎓 <b>Free Courses</b> — AI courses in regional languages<br>• 🌾 <b>Rural Outreach</b> — AI education in villages<br>• 🤝 <b>Volunteer Network</b> — 5000+ volunteers<br>• 📱 <b>Mobile Learning</b> — Learn on any device<br>• 🏆 <b>Certifications</b> — Earn recognized certs<br>• 💼 <b>Career Support</b> — Connect to AI opportunities';
      }

      // AI 4 ALL
      if (/ai\s*4\s*all|ai\s*for\s*all|ai4all|\d+\s*categor/.test(lower)) {
        return 'Our <b>AI 4 ALL</b> initiative covers 5 categories: Smart Cities, Education, Farmers, Health, and Our Planet. Each category has topics with video lessons and quizzes! Click "AI 4 ALL" in the nav to explore. 🚀';
      }

      // Volunteer
      if (/volunteer/.test(lower) || /join/.test(lower)) {
        return 'Want to volunteer? 🌟 Click the <b>"Become a Volunteer"</b> button on the home page or the <b>"Volunteer"</b> link in the nav. You can register with your name, email, department interest, and motivation. After registering, you\'ll get access to the Volunteer Portal with events, tasks, and more!';
      }

      // Login help
      if (/login|log\s*in|sign\s*in|password|forgot/.test(lower)) {
        return 'To login, click the <b>🔐 Login</b> button in the top-right. You can login as a <b>Volunteer</b> or <b>Admin</b>. For demo purposes, any email works! Just select your role and click login. Admins can manage the site content after logging in.';
      }

      // Admin help
      if (/admin/.test(lower)) {
        return 'The <b>Admin Portal</b> lets you manage: users, analytics, content editor, events, and more. Login with the Admin tab and any email to access it. From there you can edit AI 4 ALL content, manage events, and view site analytics!';
      }

      // Gallery
      if (/gallery|photo|image|picture/.test(lower)) {
        return 'Check out our <b>Gallery</b> page to see photos from our events, workshops, and outreach programs across India! Click "Gallery" in the navigation menu. 📸';
      }

      // Team
      if (/team|founder|leadership|who\s*runs|who\s*started/.test(lower)) {
        return 'Our team is led by <b>Dr. Arjun Reddy</b> (Founder & CEO), along with <b>Priya Sharma</b> (COO), <b>Rahul Verma</b> (CTO), and <b>Anita Desai</b> (Director of Outreach). You can see them in the About section on the home page! 👥';
      }

      // Contact
      if (/contact|phone|email|address|reach|call|mail/.test(lower)) {
        return 'You can reach us at:<br>📧 <b>info@aiforall.org</b><br>📞 <b>+91 9XXXXXXXXX</b><br>📍 <b>Vijayawada, Andhra Pradesh</b><br>Or visit our website: www.aiforall.org';
      }

      // Location
      if (/where|location|address|based|vijayawada|india/.test(lower) && !/contact/.test(lower)) {
        return 'We are based in <b>Vijayawada, Andhra Pradesh, India</b>, and operate across 22 states through our network of 5000+ trained volunteers. 🇮🇳';
      }

      // Timings / hours
      if (/timing|hour|when|open|available|office/.test(lower)) {
        return 'Our programs are available <b>24/7 online</b> through our platform. For office inquiries, you can reach us during business hours (9 AM - 6 PM, Mon-Sat). Our volunteers conduct field programs on weekends!';
      }

      // Donate / donation
      if (/donate|donation|contribute|support|fund/.test(lower)) {
        return 'Thank you for wanting to support us! 🙏 You can contribute by volunteering your time, donating to our cause, or spreading the word. Logged-in volunteers can make donations through the Volunteer Portal. Contact us at <b>info@aiforall.org</b> for more details.';
      }

      // Thanks
      if (/thank|thanks|thnx|ty|gratitude/.test(lower)) {
        return 'You\'re welcome! 😊 If you have any more questions, feel free to ask. We\'re here to help!';
      }

      // Bye
      if (/bye|goodbye|cya|see\s*you|tata|exit/.test(lower)) {
        return 'Goodbye! 👋 Feel free to come back anytime you need help. Have a great day!';
      }

      // Help
      if (/help|support|assist|guide|how\s*(can|do|to).*use|stuck|confused|what\s*can\s*you/.test(lower)) {
        return 'I can help you with:<br>• 🏠 <b>Site navigation</b> — finding pages<br>• 📚 <b>Programs & courses</b> — what we offer<br>• 🤝 <b>Volunteering</b> — how to join<br>• 🔐 <b>Login</b> — help signing in<br>• 🏙️ <b>Organization info</b> — about us, mission, vision<br>• 📞 <b>Contact</b> — how to reach us<br><br>Just ask me anything!';
      }

      // Default
      return 'I\'m not sure I understood that. Could you rephrase? 😊 You can ask me about:<br>• Our programs & courses<br>• How to volunteer<br>• Login help<br>• About the organization<br>• Or just say "help" to see what I can do!';
    };

    return () => {
      clearTimeout(initTimeout);
      if (typingInterval) clearInterval(typingInterval);
      clearInterval(sliderInterval);
      clearInterval(labelInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* ========== HEADER ========== */}
      <header>
        <div className="logo" onClick={() => (window as any).showPage('home')}>
          <IncuxLogo className="logo-icon" />
          <div className="logo-text-group">
            <span className="logo-title">IncuxAI</span>
            <span className="logo-subtitle">Educational Trust</span>
          </div>
        </div>
        <nav id="main-nav">
          <a onClick={() => (window as any).showPage('home')} className="active">Home</a>
          <a onClick={() => (window as any).showPage('about')}>About</a>
          <a onClick={() => (window as any).showPage('ai4all')}>AI 4 ALL</a>
          <a onClick={() => (window as any).showPage('programs')}>Programs</a>
          <a onClick={() => (window as any).showPage('gallery')}>Gallery</a>
          <a onClick={() => (window as any).showPage('volunteer')}>Volunteer</a>
        </nav>
        <div className="header-right">
          <span id="logged-user" style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '700', display: 'none' }}></span>
          <button className="btn-login" onClick={() => (window as any).handleLoginBtn()} id="login-btn">🔐 Login</button>
        </div>
      </header>

      {/* ========== HOME PAGE ========== */}
      <div id="home" className="page active">
        {/* Hero Slider */}
        <div className="hero-slider">
          {/* Particles */}
          <div className="particles" id="particles"></div>

          {/* Slides */}
          {slideImages.map((src, idx) => (
            <div
              key={idx}
              className={`slide slide-${idx + 1} ${idx === 0 ? 'active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            >
              <div className="slide-overlay"></div>
              <div className="grid-overlay"></div>
            </div>
          ))}

          {/* Hero Content */}
          <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">AI FOR ALL</h1>
            <div className="hero-tagline" id="hero-tagline">
              <span id="tagline-text"></span>
            </div>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => (window as any).showPage('ai4all')}>🚀 Explore AI Courses</button>
              <button className="btn-outline" onClick={() => (window as any).showPage('volunteer')}>🤝 Become a Volunteer</button>
            </div>
          </div>
            <div className="hero-robot">
              <canvas id="canvas3d"></canvas>
            </div>
          </div>

          {/* Chat toggle button — below robot area */}
          <button className="chat-bubble" onClick={() => (window as any).toggleChat()} title="AI Assistant">
            <span className="chat-bubble-icon">💬</span>
          </button>

          {/* Slider dots */}
          <div className="slider-dots" id="slider-dots"></div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            SCROLL
          </div>
        </div>

        {/* ========== ABOUT SECTION (inside home page) ========== */}
        <section id="about-section">
          <div className="about-grid">
            <div className="about-img">
              <div className="about-img-placeholder"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop" alt="Classroom learning" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px', display: 'block' }} /></div>
            </div>
            <div className="about-text">
              <h3>Who We Are</h3>
              <p>AI For All Educational Trust was founded by a group of technologists, educators, and social workers who saw a growing digital divide between those who understand AI and those who don't.</p>
              <p>We operate across 22 states in India, with a network of over 5,000 trained volunteers delivering AI literacy programs in local languages — Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, and more.</p>
              <p>Our programs have reached over 2 lakh learners including farmers who now use AI for crop disease detection, teachers who use AI tools to personalize education, and small business owners who use AI to grow their enterprises.</p>
            </div>
          </div>

          <div className="about-extras">
            <div className="about-extras-buttons">
              <button className="about-btn" onClick={() => (window as any).toggleAboutDetail('about-mission')}>Our Mission</button>
              <button className="about-btn" onClick={() => (window as any).toggleAboutDetail('about-vision')}>Our Vision</button>
              <button className="about-btn" onClick={() => (window as any).toggleAboutDetail('about-programs')}>Our Programs</button>
              <button className="about-btn" onClick={() => (window as any).toggleValues()}>What Drives Us <span id="values-arrow">▼</span></button>
            </div>
            <div id="about-mission" className="about-detail">
              <p>To make AI knowledge accessible, affordable, and actionable for every Indian citizen regardless of their education, age, or economic background.</p>
            </div>
            <div id="about-vision" className="about-detail">
              <p>To create a future where every Indian has the knowledge and tools to harness AI for personal and community growth.</p>
            </div>
            <div id="about-programs" className="about-detail">
              <ul className="about-program-list">
                <li><strong>Free Courses</strong> — Completely free AI courses in regional languages for people with zero tech background.</li>
                <li><strong>Rural Outreach</strong> — Taking AI education directly to villages, farms, and underserved communities across India.</li>
                <li><strong>Volunteer Network</strong> — A growing army of 5000+ volunteers spreading AI literacy across the nation.</li>
                <li><strong>Mobile Learning</strong> — Learn AI on any device, no laptop needed.</li>
                <li><strong>Certifications</strong> — Earn recognized certificates for your new AI skills.</li>
                <li><strong>Career Support</strong> — Connecting learners to AI-driven opportunities.</li>
              </ul>
            </div>
            <div id="values-list" className="values-list" style={{ display: 'none' }}>
              <div className="value-chip">🌍 Inclusivity — AI for every person, every caste, every language.</div>
              <div className="value-chip">🔓 Open Access — Free forever. No paywalls, no barriers.</div>
              <div className="value-chip">💡 Innovation — Cutting-edge curriculum that evolves with AI.</div>
              <div className="value-chip">🤲 Community — Building a supportive ecosystem of learners.</div>
              <div className="value-chip">📊 Impact — Measurable change in lives and livelihoods.</div>
            </div>
          </div>
        </section>
        {/* Team */}
        <section>
          <div className="section-header">
            <span className="section-tag">Leadership</span>
            <h2 className="section-title">Our Team</h2>
          </div>
          <div className="cards-grid cards-grid-4">
            <div className="card" style={{ textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" alt="Dr. Arjun Reddy" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Dr. Arjun Reddy</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Founder & CEO</div>
              <div className="card-text">IIT alumnus. 15+ years in AI research and rural education.</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="Dr. Priya Sharma" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Dr. Priya Sharma</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Chief Learning Officer</div>
              <div className="card-text">Curriculum design expert. Former professor at Delhi University.</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Sai Krishna" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Sai Krishna</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>CTO</div>
              <div className="card-text">Full-stack AI engineer. Built our platform from scratch.</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" alt="Meera Nair" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Meera Nair</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Head of Volunteers</div>
              <div className="card-text">Manages our 5000+ volunteer network across 22 states.</div>
            </div>
          </div>
        </section>
      </div>

      {/* ========== AI4ALL PAGE ========== */}
      <div id="ai4all" className="page" style={{ paddingTop: '75px' }}>
        <div className="ai4all-hero" style={{ padding: '4rem 5% 2rem' }}>
          <span className="section-tag">AI 4 ALL Program</span>
          <h2 className="section-title">Learn AI For Your World</h2>
          <p className="section-sub">Practical AI guides crafted for every walk of life — in simple language with real examples, videos, and quizzes.</p>
        </div>
        <div className="ai-categories" id="ai-categories-container">
          {/* Filled dynamically */}
        </div>
      </div>

      {/* ========== AI TOPIC DETAIL PAGE ========== */}
      <div id="ai-topic-detail" className="page" style={{ paddingTop: '75px' }}>
        <div className="topic-detail-header">
          <button className="btn-back" onClick={() => (window as any).backToAI4All()}>← Back to AI 4 ALL</button>
          <h2 className="topic-detail-title" id="topic-category-name">Category</h2>
          <p className="section-sub">Learn about different AI tools and how to use them in this field</p>
        </div>
        <div className="ai-topic-content" id="ai-topic-content"></div>
      </div>

      {/* ========== GALLERY ========== */}
      <div id="gallery" className="page" style={{ paddingTop: '75px' }}>
        <section>
          <div className="section-header">
            <span className="section-tag">Gallery</span>
            <h2 className="section-title">Our Moments</h2>
            <p className="section-sub">Snapshots from workshops, camps, volunteer drives, and communities we've touched.</p>
          </div>
        </section>
        <div className="gallery-folders">
          <div className="gallery-folder">
            <button className="gallery-folder-btn" onClick={() => { const e = document.getElementById('gfol-farmers'); if (e) e.style.display = e.style.display === 'none' ? 'grid' : 'none'; }}>
              <span className="gallery-folder-icon">📁</span> Farmer Workshops <span className="gallery-folder-count">3</span>
            </button>
            <div id="gfol-farmers" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Farmer AI Workshop – Andhra Pradesh</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Crop Disease Detection Camp</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Soil Analysis Training – Guntur</div></div>
            </div>
          </div>
          <div className="gallery-folder">
            <button className="gallery-folder-btn" onClick={() => { const e = document.getElementById('gfol-education'); if (e) e.style.display = e.style.display === 'none' ? 'grid' : 'none'; }}>
              <span className="gallery-folder-icon">📁</span> Education & Training <span className="gallery-folder-count">3</span>
            </button>
            <div id="gfol-education" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Teacher Training Camp – Hyderabad</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Student Hackathon – Vijayawada</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Kids AI Camp – Bangalore</div></div>
            </div>
          </div>
          <div className="gallery-folder">
            <button className="gallery-folder-btn" onClick={() => { const e = document.getElementById('gfol-volunteer'); if (e) e.style.display = e.style.display === 'none' ? 'grid' : 'none'; }}>
              <span className="gallery-folder-icon">📁</span> Volunteer Events <span className="gallery-folder-count">3</span>
            </button>
            <div id="gfol-volunteer" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Volunteer Summit 2024</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Driver AI Literacy – Chennai</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">MSME AI Workshop – Pune</div></div>
            </div>
          </div>
          <div className="gallery-folder">
            <button className="gallery-folder-btn" onClick={() => { const e = document.getElementById('gfol-celebrations'); if (e) e.style.display = e.style.display === 'none' ? 'grid' : 'none'; }}>
              <span className="gallery-folder-icon">📁</span> Celebrations & Events <span className="gallery-folder-count">3</span>
            </button>
            <div id="gfol-celebrations" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Annual Awards Night</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Rural Connectivity Drive</div></div>
              <div className="gallery-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">AI Showcase & Demo Day</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROGRAMS PAGE ========== */}
      <div id="programs" className="page" style={{ paddingTop: '75px' }}>
        <section>
          <div className="section-header">
            <span className="section-tag">Programs</span>
            <h2 className="section-title">Our Initiatives</h2>
            <p className="section-sub">Structured programs designed to create lasting impact in communities across India.</p>
          </div>
        </section>
        <div className="h-programs-list">
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">AI Kisan Seva</div>
              <div className="h-program-text">AI training for farmers covering crop disease detection, weather prediction, market price forecasting, and soil analysis using smartphone AI tools.</div>
              <div className="h-program-tags"><span className="program-tag">Agriculture</span><span className="program-tag">Free</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">Teacher AI Upskill</div>
              <div className="h-program-text">Empower educators with AI tools for personalized learning, automated grading, lesson planning, and student performance analytics.</div>
              <div className="h-program-tags"><span className="program-tag">Education</span><span className="program-tag">Certificate</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">Startup AI Launchpad</div>
              <div className="h-program-text">10-week intensive program for founders to integrate AI into product development, marketing, customer service, and operations.</div>
              <div className="h-program-tags"><span className="program-tag">Startups</span><span className="program-tag">Mentorship</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">MSME Digital Boost</div>
              <div className="h-program-text">Help small businesses adopt AI for inventory management, customer engagement, accounting automation, and digital marketing.</div>
              <div className="h-program-tags"><span className="program-tag">MSME</span><span className="program-tag">Free</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">AI Wonder Kids</div>
              <div className="h-program-text">Fun, gamified AI education for children aged 6–16. Programming basics, creative AI tools, and critical thinking through play.</div>
              <div className="h-program-tags"><span className="program-tag">Kids</span><span className="program-tag">Free</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=400&auto=format&fit=crop)' }}></div>
            <div className="h-program-body">
              <div className="h-program-title">Smart Household AI</div>
              <div className="h-program-text">Teaching homemakers to use AI for budgeting, health monitoring, cooking optimization, and child education support.</div>
              <div className="h-program-tags"><span className="program-tag">Household</span><span className="program-tag">Free</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== VOLUNTEER PUBLIC PAGE ========== */}
      <div id="volunteer" className="page" style={{ paddingTop: '75px' }}>
        <section>
          <div className="section-header">
            <span className="section-tag">Our Volunteer Army</span>
            <h2 className="section-title">The Heart of AI For All</h2>
            <p className="section-sub">5000+ passionate volunteers changing lives every single day. Join us and make a difference.</p>
          </div>
        </section>
        {/* Stats */}
        <div className="volunteer-stats">
          <div className="vol-stat"><div className="vol-stat-num">5,247</div><div className="vol-stat-label">Total Volunteers</div></div>
          <div className="vol-stat"><div className="vol-stat-num">22</div><div className="vol-stat-label">States Covered</div></div>
          <div className="vol-stat"><div className="vol-stat-num">1.8L+</div><div className="vol-stat-label">Hours Volunteered</div></div>
          <div className="vol-stat"><div className="vol-stat-num">2L+</div><div className="vol-stat-label">Lives Impacted</div></div>
        </div>
        {/* Recent Works */}
        <div className="vol-works">
          <h2>Recent Volunteer Activities</h2>
          <div className="vol-work-item"><div className="vol-work-info"><h4>Farmer AI Workshop – Guntur District</h4><p>Team of 12 volunteers conducted 3-day training for 200+ farmers</p></div><span className="vol-work-badge">Completed</span></div>
          <div className="vol-work-item"><div className="vol-work-info"><h4>School AI Literacy Camp – Vijayawada</h4><p>Reached 800 students across 5 government schools</p></div><span className="vol-work-badge">Completed</span></div>
          <div className="vol-work-item"><div className="vol-work-info"><h4>MSME Digital Workshop – Visakhapatnam</h4><p>50+ small business owners trained in AI tools</p></div><span className="vol-work-badge">Completed</span></div>
          <div className="vol-work-item">
            <div className="vol-work-info"><h4>AI for Drivers – Hyderabad</h4><p>Navigation AI and safety tools training for 300 auto/cab drivers</p></div>
            <span className="vol-work-badge" style={{ color: 'var(--secondary)', borderColor: 'rgba(212, 76, 119, 0.3)', background: 'rgba(212, 76, 119, 0.1)' }}>Ongoing</span>
          </div>
        </div>
        {/* Registration Form */}
        <div className="form-wrap" style={{ maxWidth: '700px' }}>
          <div className="form-card">
            <div className="form-title">🤝 Register as Volunteer</div>
            <div className="form-sub">Join our mission to spread AI education across India</div>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input type="text" placeholder="Ravi" id="vol-fname" /></div>
              <div className="form-group"><label>Last Name</label><input type="text" placeholder="Kumar" id="vol-lname" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" placeholder="ravi@email.com" id="vol-email" /></div>
              <div className="form-group"><label>Phone</label><input type="tel" placeholder="+91 9XXXXXXXXX" id="vol-phone" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>City / District</label><input type="text" placeholder="Vijayawada" id="vol-city" /></div>
              <div className="form-group">
                <label>State</label>
                <select id="vol-state">
                  <option value="">Select State</option>
                  <option>Andhra Pradesh</option><option>Telangana</option><option>Tamil Nadu</option>
                  <option>Karnataka</option><option>Maharashtra</option><option>Gujarat</option>
                  <option>Rajasthan</option><option>Uttar Pradesh</option><option>West Bengal</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Preferred Department</label>
              <select id="vol-dept">
                <option value="">Select Department</option>
                <option>AI Training & Education</option>
                <option>Content Creation</option>
                <option>Field Outreach</option>
                <option>Event Management</option>
                <option>Technology & Platform</option>
                <option>Social Media</option>
                <option>Fund Raising</option>
              </select>
            </div>
            <div className="form-group">
              <label>Availability (hours/week)</label>
              <select id="vol-hours">
                <option>2-5 hours</option><option>5-10 hours</option><option>10-20 hours</option><option>Full-time</option>
              </select>
            </div>
            <div className="form-group">
              <label>Why do you want to volunteer?</label>
              <textarea rows={3} placeholder="Tell us about your motivation..." id="vol-why" style={{ resize: 'vertical' }}></textarea>
            </div>
            <div className="form-group"><label>Create Password</label><input type="password" placeholder="••••••••" id="vol-pass" /></div>
            <button className="btn-submit" onClick={() => (window as any).registerVolunteer()}>🚀 Register & Create Account</button>
          </div>
        </div>
      </div>

      {/* ========== VOLUNTEER PORTAL ========== */}
      <div id="vol-portal" className="page">
        <div className="portal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--primary)' }}>Volunteer Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Welcome back, <span id="portal-name" style={{ color: 'var(--primary)', fontWeight: '700' }}></span></p>
          </div>
          <div className="portal-user">
            <div className="avatar" id="portal-avatar">V</div>
            <div>
              <div style={{ fontWeight: '700' }} id="portal-fullname">Volunteer</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} id="portal-dept-display">Department</div>
            </div>
          </div>
        </div>
        <div className="portal-nav">
          <button className="portal-nav-btn active" onClick={(e) => (window as any).showPortalSection('vol-dashboard', e)}>📊 Dashboard</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-events', e)}>📅 Events</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-history', e)}>📋 My History</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-tasks', e)}>✅ My Tasks</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-attendance', e)}>🗓️ Attendance</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-donations', e)}>💝 Donations</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-progress', e)}>📊 My Progress</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-courses', e)}>📚 Courses</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-quiz', e)}>🧠 Quizzes</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-leaderboard', e)}>🏆 Leaderboard</button>
        </div>

        {/* Dashboard */}
        <div id="vol-dashboard" className="portal-section active">
          <div className="hours-display">
            <div className="hours-box"><div className="hours-num" id="total-hours">47</div><div className="hours-label">Total Hours</div></div>
            <div className="hours-box"><div className="hours-num">3</div><div className="hours-label">Events Attended</div></div>
            <div className="hours-box"><div className="hours-num">2</div><div className="hours-label">Upcoming Events</div></div>
            <div className="hours-box"><div className="hours-num">₹500</div><div className="hours-label">Total Donated</div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Recent Activities</h3>
          <div className="task-card"><div className="task-title">✅ Farmer Workshop – Guntur</div><div className="task-desc">Completed 3-day AI training session. Helped 50+ farmers understand crop disease AI tools.</div><div className="task-footer"><span className="task-due">12 hours earned</span><span className="badge badge-green">Completed</span></div></div>
          <div className="task-card"><div className="task-title">📋 School Visit – Vijayawada</div><div className="task-desc">AI literacy session for class 8-10 students. Covered ChatGPT, image generation basics.</div><div className="task-footer"><span className="task-due">8 hours earned</span><span className="badge badge-green">Completed</span></div></div>
        </div>

        {/* Events */}
        <div id="vol-events" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Select Departments to Participate</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Choose your area of interest</p>
          <div className="dept-grid">
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>AI Training & Education</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Content Creation</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Field Outreach</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Event Management</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Technology & Platform</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Social Media</div>
            <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Fund Raising</div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', margin: '1.5rem 0 0.5rem' }}>Upcoming Events</h3>
          <div className="events-grid" id="vol-events-list">
            <div className="event-card"><div className="event-date-bar"><span>📅 June 15, 2025</span><span>Vijayawada</span></div><div className="event-body"><div className="event-title">AI for Farmers Workshop</div><div className="event-dept">Department: <span>AI Training & Education</span></div><div className="event-slots">⚠️ 8 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
            <div className="event-card"><div className="event-date-bar"><span>📅 June 22, 2025</span><span>Guntur</span></div><div className="event-body"><div className="event-title">School AI Literacy Drive</div><div className="event-dept">Department: <span>Field Outreach</span></div><div className="event-slots">⚠️ 15 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
            <div className="event-card"><div className="event-date-bar"><span>📅 July 1, 2025</span><span>Hyderabad</span></div><div className="event-body"><div className="event-title">MSME Digital AI Workshop</div><div className="event-dept">Department: <span>Content Creation</span></div><div className="event-slots">⚠️ 5 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
          </div>
        </div>

        {/* History */}
        <div id="vol-history" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>My Event Participations</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Mar 10, 2025</td><td>Guntur</td><td>12 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>School Visit Program</td><td>Apr 5, 2025</td><td>Vijayawada</td><td>8 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>MSME Workshop</td><td>Apr 20, 2025</td><td>Visakhapatnam</td><td>6 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>AI for Drivers Camp</td><td>May 10, 2025</td><td>Hyderabad</td><td>–</td><td><span className="badge badge-orange">Absent</span></td></tr>
            </tbody>
          </table>
          <div className="hours-display" style={{ marginTop: '1.5rem' }}>
            <div className="hours-box"><div className="hours-num">47</div><div className="hours-label">Total Hours Logged</div></div>
            <div className="hours-box"><div className="hours-num">3</div><div className="hours-label">Completed Events</div></div>
            <div className="hours-box"><div className="hours-num">Level 2</div><div className="hours-label">Volunteer Rank</div></div>
          </div>
        </div>

        {/* Tasks */}
        <div id="vol-tasks" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Tasks Assigned to Me</h3>
          <div id="vol-tasks-list">
            <div className="task-card"><div className="task-title">📄 Create Hindi content for AI Farming module</div><div className="task-desc">Write 500-word introduction about how farmers can use AI on their smartphones. Include 3 practical examples.</div><div className="task-footer"><span className="task-due">Due: June 10, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
            <div className="task-card"><div className="task-title">📊 Prepare attendance report for Guntur workshop</div><div className="task-desc">Compile attendance from the March 10 event and share the Excel sheet with the coordinator.</div><div className="task-footer"><span className="task-due">Due: June 7, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
            <div className="task-card"><div className="task-title">📱 Social media posts for July event</div><div className="task-desc">Create 5 Instagram/WhatsApp post designs promoting the upcoming MSME Digital AI Workshop.</div><div className="task-footer"><span className="task-due">Due: June 25, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
          </div>
        </div>

        {/* Attendance */}
        <div id="vol-attendance" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>My Attendance Record</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Check-in Time</th><th>Check-out Time</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Mar 10</td><td>9:00 AM</td><td>9:00 PM</td><td>12</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>School Visit</td><td>Apr 5</td><td>10:00 AM</td><td>6:00 PM</td><td>8</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>MSME Workshop</td><td>Apr 20</td><td>11:00 AM</td><td>5:00 PM</td><td>6</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>AI Drivers Camp</td><td>May 10</td><td>–</td><td>–</td><td>0</td><td><span className="badge badge-orange">Absent</span></td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Attendance Rate</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }}></div></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.3rem', fontWeight: '700' }}>75% (3 of 4 events)</div>
          </div>
        </div>

        {/* Donations */}
        <div id="vol-donations" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>My Donation History</h3>
          <div className="donation-history">
            <div className="donation-item"><div><div style={{ fontWeight: '700', fontSize: '0.9rem' }}>AI Kisan Seva Fund</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Apr 1, 2025</div></div><div className="donation-amount">₹200</div></div>
            <div className="donation-item"><div><div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Kids AI Camp Sponsor</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mar 15, 2025</div></div><div className="donation-amount">₹300</div></div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>Make a New Donation</h4>
            <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="Enter amount" id="donation-amount" /></div>
            <div className="form-group">
              <label>Fund</label>
              <select id="donation-fund">
                <option>AI Kisan Seva</option>
                <option>Kids AI Camp</option>
                <option>General Fund</option>
                <option>MSME Support</option>
              </select>
            </div>
            <button className="btn-submit" onClick={() => (window as any).makeDonation()} style={{ marginTop: '0.5rem' }}>💝 Donate Now</button>
          </div>
        </div>

        {/* ========== MERGED STUDENT SECTIONS ========== */}
        <div id="st-progress" className="portal-section">
          <div className="student-progress-header">
            <div className="student-level">
              <div className="level-badge">L3</div>
              <div>
                <h3>AI Explorer</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete 2 more modules to reach Level 4</p>
                <div className="xp-bar"><div className="xp-fill" style={{ width: '65%' }}></div></div>
                <div className="xp-label">650 / 1000 XP</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>6/10</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Modules Done</div>
              </div>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>My Learning Path</h3>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.2rem' }}>
            <div className="progress-label"><span>Overall Course Completion</span><span style={{ color: 'var(--primary)' }}>60%</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: '60%' }}></div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', margin: '1.5rem 0 1rem' }}>Recent Activity</h3>
          <div className="task-card"><div className="task-title">✅ Completed: Introduction to AI</div><div className="task-desc">Score: 90% | Time: 45 min | XP Earned: +100</div></div>
          <div className="task-card"><div className="task-title">✅ Completed: AI Tools for Daily Life</div><div className="task-desc">Score: 85% | Time: 60 min | XP Earned: +100</div></div>
          <div className="task-card"><div className="task-title">📖 In Progress: ChatGPT for Work</div><div className="task-desc">40% completed | Resume anytime</div></div>
        </div>

        <div id="st-courses" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>All Modules</h3>
          <div className="subject-cards">
            <div className="subject-card"><div className="subject-icon">🤖</div><div className="subject-name">What is AI?</div><div className="subject-progress">100% complete</div><div className="subject-bar"><div className="subject-fill" style={{ width: '100%' }}></div></div><div className="subject-lessons">5/5 lessons done</div></div>
            <div className="subject-card"><div className="subject-icon">💬</div><div className="subject-name">ChatGPT Basics</div><div className="subject-progress">80% complete</div><div className="subject-bar"><div className="subject-fill" style={{ width: '80%' }}></div></div><div className="subject-lessons">4/5 lessons done</div></div>
            <div className="subject-card"><div className="subject-icon">🖼️</div><div className="subject-name">AI Image Tools</div><div className="subject-progress">60% complete</div><div className="subject-bar"><div className="subject-fill" style={{ width: '60%' }}></div></div><div className="subject-lessons">3/5 lessons done</div></div>
            <div className="subject-card"><div className="subject-icon">📊</div><div className="subject-name">AI for Data</div><div className="subject-progress">0% — not started</div><div className="subject-bar"><div className="subject-fill" style={{ width: '0%' }}></div></div><div className="subject-lessons">0/5 lessons done</div></div>
            <div className="subject-card"><div className="subject-icon">🔊</div><div className="subject-name">AI Voice & Audio</div><div className="subject-progress">0% — not started</div><div className="subject-bar"><div className="subject-fill" style={{ width: '0%' }}></div></div><div className="subject-lessons">0/5 lessons done</div></div>
            <div className="subject-card"><div className="subject-icon">🌾</div><div className="subject-name">AI for Farming</div><div className="subject-progress">40% complete</div><div className="subject-bar"><div className="subject-fill" style={{ width: '40%' }}></div></div><div className="subject-lessons">2/5 lessons done</div></div>
          </div>
        </div>

        <div id="st-quiz" className="portal-section">
          <div className="student-quiz">
            <div className="quiz-header"><div className="quiz-title">🧠 Daily Quiz Challenge</div><div className="quiz-score" id="quiz-score-display">Score: 0</div></div>
            <div id="quiz-container"></div>
          </div>
        </div>

        <div id="st-leaderboard" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>🏆 Top Learners This Month</h3>
          <div className="leaderboard">
            <div className="leaderboard-item"><div className="lb-rank top">🥇</div><div className="lb-name">Anjali Mishra</div><div className="lb-xp">1,240 XP</div></div>
            <div className="leaderboard-item"><div className="lb-rank top">🥈</div><div className="lb-name">Dev Kumar</div><div className="lb-xp">1,100 XP</div></div>
            <div className="leaderboard-item"><div className="lb-rank top">🥉</div><div className="lb-name">Sneha Rao</div><div className="lb-xp">980 XP</div></div>
            <div className="leaderboard-item"><div className="lb-rank">4</div><div className="lb-name">You</div><div className="lb-xp" style={{ color: 'var(--accent)' }}>650 XP</div></div>
            <div className="leaderboard-item"><div className="lb-rank">5</div><div className="lb-name">Ramesh P.</div><div className="lb-xp">620 XP</div></div>
            <div className="leaderboard-item"><div className="lb-rank">6</div><div className="lb-name">Fatima B.</div><div className="lb-xp">590 XP</div></div>
          </div>
        </div>
      </div>

      {/* ========== ADMIN PORTAL ========== */}
      <div id="admin-portal" className="page">
        <div className="portal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--secondary)' }}>Admin Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full system control</p>
          </div>
          <div className="portal-user">
            <div className="avatar" style={{ background: 'linear-gradient(135deg,var(--secondary),#d44c77)' }}>A</div>
            <div><div style={{ fontWeight: '700' }}>Admin</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Super Admin</div></div>
          </div>
        </div>
        <div className="portal-nav">
          <button className="portal-nav-btn active" onClick={(e) => (window as any).showAdminSection('admin-overview', e)}>📊 Overview</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-events', e)}>📅 Events</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-registrations', e)}>📋 Registrations</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-attendance', e)}>🗓️ Attendance</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-volunteers', e)}>👥 Volunteers</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-tasks', e)}>✅ Assign Tasks</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-content', e)}>📝 AI4ALL Content</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-analytics', e)}>📈 Analytics</button>
        </div>

        {/* Overview */}
        <div id="admin-overview" className="portal-section active">
          <div className="admin-grid">
            <div className="admin-metric"><div className="admin-metric-num">5,247</div><div className="admin-metric-label">Total Volunteers</div><div className="admin-metric-delta">↑ 127 this month</div></div>
            <div className="admin-metric"><div className="admin-metric-num">2,18,500</div><div className="admin-metric-label">Total Learners</div><div className="admin-metric-delta">↑ 8,200 this month</div></div>
            <div className="admin-metric"><div className="admin-metric-num">47</div><div className="admin-metric-label">Active Events</div><div className="admin-metric-delta">12 upcoming</div></div>
            <div className="admin-metric"><div className="admin-metric-num">1.8L hrs</div><div className="admin-metric-label">Volunteer Hours</div><div className="admin-metric-delta">↑ 2,400 this month</div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Recent Registrations</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Department</th><th>Registered</th></tr></thead>
            <tbody id="admin-recent-vols">
              <tr><td>Ravi Kumar</td><td>ravi@gmail.com</td><td>AP</td><td>AI Training</td><td>Today</td></tr>
              <tr><td>Priya Nair</td><td>priya@gmail.com</td><td>Kerala</td><td>Content Creation</td><td>Yesterday</td></tr>
              <tr><td>Arun Singh</td><td>arun@gmail.com</td><td>UP</td><td>Field Outreach</td><td>2 days ago</td></tr>
            </tbody>
          </table>
        </div>

        {/* Admin Events */}
        <div id="admin-events" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Create New Event</h3>
          <div className="create-event-form">
            <div className="form-row">
              <div className="form-group"><label>Event Title</label><input type="text" id="ev-title" placeholder="e.g. Farmer AI Workshop" /></div>
              <div className="form-group"><label>Date</label><input type="date" id="ev-date" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Location</label><input type="text" id="ev-location" placeholder="City, State" /></div>
              <div className="form-group"><label>Max Volunteers</label><input type="number" id="ev-slots" placeholder="50" /></div>
            </div>
            <div className="form-group">
              <label>Required Departments</label>
              <div className="dept-grid" id="admin-dept-select">
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>AI Training</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Field Outreach</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Content Creation</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Event Management</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Technology</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Social Media</div>
              </div>
            </div>
            <div className="form-group"><label>Description</label><textarea id="ev-desc" rows={3} placeholder="Event details..." style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'Inter', outline: 'none', resize: 'vertical' }}></textarea></div>
            <button className="btn-submit" onClick={() => (window as any).createEvent()}>➕ Create Event</button>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>All Events</h3>
          <table className="data-table" id="admin-events-table">
            <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Registered</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Jun 15</td><td>Vijayawada</td><td>42/50</td><td><span className="badge badge-blue">Open</span></td><td><button className="btn-small btn-danger-small" onClick={(e) => (window as any).deleteEventRow(e.currentTarget)}>Delete</button></td></tr>
              <tr><td>School Literacy Drive</td><td>Jun 22</td><td>Guntur</td><td>35/60</td><td><span className="badge badge-blue">Open</span></td><td><button className="btn-small btn-danger-small" onClick={(e) => (window as any).deleteEventRow(e.currentTarget)}>Delete</button></td></tr>
            </tbody>
          </table>
        </div>

        {/* Event Registrations */}
        <div id="admin-registrations" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Event Registrations</h3>
          <table className="data-table">
            <thead><tr><th>Volunteer Name</th><th>Email</th><th>Event</th><th>Registered On</th></tr></thead>
            <tbody id="admin-registrations-body">
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading...</td></tr>
            </tbody>
          </table>
        </div>

        {/* Attendance */}
        <div id="admin-attendance" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Mark Attendance</h3>
          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
            <label>Select Event</label>
            <select>
              <option>Farmer AI Workshop – Jun 15</option>
              <option>School Literacy Drive – Jun 22</option>
            </select>
          </div>
          <table className="data-table attendance-table">
            <thead><tr><th>Volunteer</th><th>Department</th><th>Registered?</th><th>Mark Attendance</th></tr></thead>
            <tbody>
              <tr><td>Ravi Kumar</td><td>AI Training</td><td><span className="badge badge-green">Yes</span></td><td><button className="attend-btn attend-present" onClick={(e) => (window as any).toggleAttend(e.currentTarget)}>Present</button></td></tr>
              <tr><td>Priya Nair</td><td>Content Creation</td><td><span className="badge badge-green">Yes</span></td><td><button className="attend-btn attend-absent" onClick={(e) => (window as any).toggleAttend(e.currentTarget)}>Absent</button></td></tr>
              <tr><td>Arun Singh</td><td>Field Outreach</td><td><span className="badge badge-green">Yes</span></td><td><button className="attend-btn attend-present" onClick={(e) => (window as any).toggleAttend(e.currentTarget)}>Present</button></td></tr>
              <tr><td>Neha Verma</td><td>Event Management</td><td><span className="badge badge-green">Yes</span></td><td><button className="attend-btn attend-present" onClick={(e) => (window as any).toggleAttend(e.currentTarget)}>Present</button></td></tr>
            </tbody>
          </table>
          <button className="btn-submit" style={{ maxWidth: '200px', marginTop: '1rem' }} onClick={() => (window as any).showToast('✅ Attendance saved successfully!')}>💾 Save Attendance</button>
        </div>

        {/* Volunteers */}
        <div id="admin-volunteers" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>All Volunteers</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Dept</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Ravi Kumar</td><td>ravi@gmail.com</td><td>AP</td><td>AI Training</td><td>47</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td>Priya Nair</td><td>priya@gmail.com</td><td>Kerala</td><td>Content</td><td>32</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td>Arun Singh</td><td>arun@gmail.com</td><td>UP</td><td>Field</td><td>28</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td>Neha Verma</td><td>neha@gmail.com</td><td>MH</td><td>Events</td><td>15</td><td><span className="badge badge-orange">Inactive</span></td></tr>
              <tr><td>Rohan Das</td><td>rohan@gmail.com</td><td>WB</td><td>Social Media</td><td>22</td><td><span className="badge badge-green">Active</span></td></tr>
            </tbody>
          </table>
        </div>

        {/* Assign Tasks */}
        <div id="admin-tasks" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Assign Work to Volunteers</h3>
          <div className="create-event-form">
            <div className="assign-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <label>Select Volunteer</label>
                <select id="assign-vol">
                  <option>Ravi Kumar</option>
                  <option>Priya Nair</option>
                  <option>Arun Singh</option>
                  <option>Neha Verma</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, margin: 0 }}><label>Task Title</label><input type="text" id="task-title" placeholder="e.g. Create Hindi content" /></div>
            </div>
            <div className="assign-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}><label>Description</label><textarea id="task-desc" rows={2} placeholder="Task details..."></textarea></div>
              <div className="form-group" style={{ flex: 0.4, margin: 0 }}><label>Due Date</label><input type="date" id="task-due" /></div>
            </div>
            <button className="btn-submit" onClick={() => (window as any).assignTask()}>📋 Assign Task</button>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Assigned Tasks</h3>
          <div id="assigned-tasks-list">
            <div className="task-card"><div className="task-title">Ravi Kumar → Create Hindi content for AI Farming module</div><div className="task-desc">Due: June 10 | Status: In Progress</div></div>
            <div className="task-card"><div className="task-title">Priya Nair → Design social media posts for July event</div><div className="task-desc">Due: June 25 | Status: Pending</div></div>
          </div>
        </div>

        {/* Content Editor */}
        <div id="admin-content" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Edit AI 4 ALL Page Content</h3>
          <div id="content-editor-list"></div>
        </div>

        {/* Analytics */}
        <div id="admin-analytics" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Content & Learning Analytics</h3>
          <div className="analytics-grid" id="analytics-grid"></div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', margin: '1.5rem 0 1rem' }}>Top Performers</h3>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Modules Completed</th><th>Quiz Score</th><th>Time Spent</th></tr></thead>
            <tbody>
              <tr><td>Anjali M.</td><td>8/10</td><td>92%</td><td>18 hrs</td></tr>
              <tr><td>Dev K.</td><td>7/10</td><td>88%</td><td>15 hrs</td></tr>
              <tr><td>Sneha R.</td><td>6/10</td><td>85%</td><td>12 hrs</td></tr>
            </tbody>
          </table>
        </div>
      </div>



      {/* ========== LOGIN MODAL ========== */}
      <div className="modal-overlay" id="login-modal">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal()}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700' }}>Welcome Back</h2>
          </div>
          <div className="modal-tabs">
            <button className="modal-tab active" onClick={(e) => (window as any).switchTab('volunteer-tab', e)}>Volunteer</button>
            <button className="modal-tab" onClick={(e) => (window as any).switchTab('admin-tab', e)}>Admin</button>
          </div>
          {/* Volunteer Login */}
          <div className="modal-form active" id="volunteer-tab">
            <div className="form-group"><label>Email</label><input type="email" id="vol-login-email" placeholder="your@email.com" /></div>
            <div className="form-group"><label>Password</label><input type="password" id="vol-login-pass" placeholder="••••••••" /></div>
            <button className="btn-submit" onClick={() => (window as any).loginUser('volunteer')}>🚀 Login</button>
          </div>
          {/* Admin Login */}
          <div className="modal-form" id="admin-tab">
            <div className="form-group"><label>Admin Email</label><input type="email" id="ad-login-email" placeholder="admin@aiforall.org" /></div>
            <div className="form-group"><label>Admin Password</label><input type="password" id="ad-login-pass" placeholder="••••••••" /></div>
            <button className="btn-submit" onClick={() => (window as any).loginUser('admin')} style={{ background: 'linear-gradient(135deg,var(--secondary),#d44c77)' }}>🛡️ Login as Admin</button>
          </div>
          {/* Success */}
          <div className="modal-success" id="modal-success">
            <div className="check">✅</div>
            <h3>Login Successful!</h3>
            <p id="success-msg">Redirecting to your portal...</p>
          </div>
        </div>
      </div>

      {/* ========== AI CHAT MODAL ========== */}
      <div id="chat-modal" className="chat-modal">
        <div className="chat-modal-content">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-icon">🤖</span>
              <div>
                <div className="chat-header-title">AI Assistant</div>
                <div className="chat-header-status">Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => (window as any).toggleChat()}>✕</button>
          </div>
          <div className="chat-messages" id="chat-messages">
            <div className="chat-msg bot">
              <div className="chat-msg-content">Hi! I'm the AI assistant. How can I help you today? You can ask me about our programs, volunteering, login help, or anything about AI For All Educational Trust.</div>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" id="chat-input" className="chat-input" placeholder="Type your message..." onKeyDown={(e) => { if (e.key === 'Enter') (window as any).sendChatMessage(); }} />
            <button className="chat-send" onClick={() => (window as any).sendChatMessage()}>➤</button>
          </div>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer id="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={() => (window as any).showPage('home')}>
              <IncuxLogo className="logo-icon" style={{ height: '48px', width: 'auto' }} />
              <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                <span className="logo-title" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)' }}>IncuxAI</span>
                <span className="logo-subtitle" style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>Educational Trust</span>
              </div>
            </div>
            <p>An educational trust dedicated to making AI knowledge accessible to every Indian citizen regardless of background, language, or economic status.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => (window as any).showPage('home')}>Home</a></li>
              <li><a onClick={() => (window as any).showPage('about')}>About Us</a></li>
              <li><a onClick={() => (window as any).showPage('ai4all')}>AI 4 ALL</a></li>
              <li><a onClick={() => (window as any).showPage('programs')}>Programs</a></li>
              <li><a onClick={() => (window as any).showPage('gallery')}>Gallery</a></li>
              <li><a onClick={() => (window as any).showPage('volunteer')}>Volunteer</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Programs</h4>
            <ul>
              <li><a>AI for Farmers</a></li>
              <li><a>AI for Teachers</a></li>
              <li><a>AI for Students</a></li>
              <li><a>AI for MSMEs</a></li>
              <li><a>AI for Kids</a></li>
              <li><a>Free Courses</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a>📧 info@aiforall.org</a></li>
              <li><a>📞 +91 9XXXXXXXXX</a></li>
              <li><a>📍 Vijayawada, AP</a></li>
              <li><a>🌐 www.aiforall.org</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AI For All Educational Trust. All rights reserved. | Non-Profit | Registered Trust</p>
          <div className="social-links">
            <a className="social-link">f</a>
            <a className="social-link">in</a>
            <a className="social-link">🐦</a>
            <a className="social-link">▶</a>
          </div>
        </div>
      </footer>
    </>
  );
}
