export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'assignment';
  duration: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'upload';
  quizQuestions?: QuizQuestion[];
  resources?: { title: string; url: string }[];
  transcript?: string;
  notes?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  instructorRole: string;
  lastUpdated: string;
  totalDuration: string;
  chapters: Chapter[];
}

export const HR_COURSE: Course = {
  id: 'ai-for-hr',
  title: 'AI for Human Resources',
  subtitle: 'Master AI-powered HR practices from recruitment to employee engagement',
  instructor: 'IncuXAI Academy',
  instructorRole: 'AI Education Platform',
  lastUpdated: 'July 2026',
  totalDuration: '8h 30m',
  chapters: [
    {
      id: 'ch-1',
      title: 'Introduction to AI in HR',
      lessons: [
        {
          id: 'l-1-1',
          title: 'Welcome & Course Overview',
          description: 'Get an overview of how AI is transforming the HR landscape. Learn what you will achieve by the end of this course.',
          type: 'video',
          duration: '12:30',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Welcome to AI for Human Resources. In this course, we will explore how artificial intelligence is revolutionizing every aspect of human resource management. From automated recruitment pipelines to predictive employee analytics, AI is reshaping how organizations attract, develop, and retain talent. Let us begin this transformative journey together.',
          notes: 'Key Takeaways:\n• AI is transforming HR across all functions\n• This course covers recruitment to retention\n• Hands-on exercises will build practical skills',
        },
        {
          id: 'l-1-2',
          title: 'The Evolution of HR Technology',
          description: 'Trace the journey from paper-based HR to modern AI-driven systems. Understand the key milestones in HR tech evolution.',
          type: 'video',
          duration: '18:45',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'HR technology has evolved dramatically over the past decades. We started with paper filing cabinets and manual payroll systems. The first wave of digitization brought us HRIS systems in the 1990s. Then came cloud-based solutions in the 2010s. Now, we are in the age of AI where machine learning algorithms can predict attrition, screen resumes, and even conduct initial interviews.',
          notes: 'Timeline:\n• 1990s: First HRIS systems\n• 2000s: ERP integration\n• 2010s: Cloud HR platforms\n• 2020s: AI-powered HR',
        },
        {
          id: 'l-1-3',
          title: 'Chapter 1 Knowledge Check',
          description: 'Test your understanding of AI fundamentals in HR.',
          type: 'quiz',
          duration: '5:00',
          quizQuestions: [
            {
              question: 'What is the primary benefit of AI in HR recruitment?',
              options: [
                'Eliminating the need for HR professionals',
                'Automating repetitive screening tasks to save time',
                'Replacing all human judgment in hiring',
                'Reducing employee salaries',
              ],
              correctIndex: 1,
              explanation: 'AI automates repetitive screening tasks, allowing HR professionals to focus on strategic decisions and human interaction.',
            },
            {
              question: 'Which decade saw the first HR Information Systems (HRIS)?',
              options: ['1980s', '1990s', '2000s', '2010s'],
              correctIndex: 1,
              explanation: 'The first HRIS systems emerged in the 1990s, marking the beginning of digital HR management.',
            },
            {
              question: 'What is NOT a common AI application in modern HR?',
              options: [
                'Resume screening',
                'Predictive attrition analysis',
                'Replacing employee benefits',
                'Chatbots for employee queries',
              ],
              correctIndex: 2,
              explanation: 'AI does not replace employee benefits. It enhances HR processes like screening, prediction, and employee support.',
            },
          ],
        },
      ],
    },
    {
      id: 'ch-2',
      title: 'AI-Powered Recruitment',
      lessons: [
        {
          id: 'l-2-1',
          title: 'Automated Resume Screening',
          description: 'Learn how AI algorithms parse, rank, and shortlist resumes with unprecedented accuracy and speed.',
          type: 'video',
          duration: '22:10',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Automated resume screening is one of the most impactful AI applications in HR. Modern AI systems can parse thousands of resumes in seconds, extracting key skills, experience levels, and qualifications. These systems use natural language processing to understand context, not just keywords. For example, an AI can understand that "managed a team of 10" implies leadership experience.',
          notes: 'Key Concepts:\n• NLP for resume parsing\n• Skill matching algorithms\n• Bias detection in screening\n• Integration with ATS platforms',
        },
        {
          id: 'l-2-2',
          title: 'AI Interview Assistants',
          description: 'Explore AI tools that help structure interviews, generate questions, and analyze candidate responses.',
          type: 'video',
          duration: '20:30',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'AI interview assistants are transforming how companies conduct interviews. These tools can generate role-specific interview questions, analyze candidate responses for competency indicators, and even provide real-time coaching to interviewers. They help ensure consistency across interviews while reducing unconscious bias.',
          notes: 'Tools to explore:\n• Structured interview generators\n• Sentiment analysis for responses\n• Competency mapping\n• Interview scoring rubrics',
        },
        {
          id: 'l-2-3',
          title: 'Building an AI Recruitment Pipeline',
          description: 'Step-by-step guide to creating an end-to-end AI-powered recruitment workflow.',
          type: 'video',
          duration: '25:00',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Building an AI recruitment pipeline requires careful planning. Start with defining your ideal candidate profile. Then integrate AI tools at each stage: sourcing, screening, interviewing, and decision-making. The key is to keep humans in the loop for final decisions while letting AI handle volume and consistency.',
          notes: 'Pipeline stages:\n1. AI sourcing from multiple channels\n2. Automated screening & ranking\n3. AI-assisted interviews\n4. Data-driven decision support\n5. Automated communication',
        },
        {
          id: 'l-2-4',
          title: 'Recruitment AI Quiz',
          description: 'Test your knowledge of AI-powered recruitment techniques.',
          type: 'quiz',
          duration: '5:00',
          quizQuestions: [
            {
              question: 'What technology powers modern resume parsing?',
              options: ['Computer Vision', 'Natural Language Processing', 'Blockchain', 'Quantum Computing'],
              correctIndex: 1,
              explanation: 'Natural Language Processing (NLP) enables AI to understand the context and meaning within resume text.',
            },
            {
              question: 'Why is "human in the loop" important in AI recruitment?',
              options: [
                'AI cannot make decisions at all',
                'Humans provide final judgment and catch AI errors',
                'Laws require human-only hiring',
                'AI is too slow without humans',
              ],
              correctIndex: 1,
              explanation: 'Humans in the loop ensure final decisions account for nuance, context, and catch potential AI biases or errors.',
            },
          ],
        },
        {
          id: 'l-2-5',
          title: 'Assignment: Design an AI Recruitment Workflow',
          description: 'Apply what you learned by designing an AI-powered recruitment process for a fictional company.',
          type: 'assignment',
          duration: '45:00',
          notes: 'Assignment Brief:\n\nDesign an AI recruitment workflow for "TechStart Inc." — a 200-person startup hiring 50 engineers in 3 months.\n\nRequirements:\n1. Map out each recruitment stage\n2. Identify where AI tools will be used\n3. Define human checkpoints\n4. Create a timeline\n5. Estimate cost savings vs traditional hiring\n\nSubmit your workflow as a structured document.',
        },
      ],
    },
    {
      id: 'ch-3',
      title: 'Employee Onboarding with AI',
      lessons: [
        {
          id: 'l-3-1',
          title: 'Smart Onboarding Platforms',
          description: 'Discover how AI-driven onboarding platforms personalize the new hire experience from day one.',
          type: 'video',
          duration: '19:20',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Smart onboarding platforms use AI to create personalized onboarding journeys. They analyze the new hire role, department, and even learning style to customize the onboarding experience. Tasks are prioritized, mentors are matched, and progress is tracked automatically.',
          notes: 'Features of smart onboarding:\n• Personalized learning paths\n• Automated document collection\n• AI chatbot for new hire questions\n• Progress tracking & alerts',
        },
        {
          id: 'l-3-2',
          title: 'AI Chatbots for New Employees',
          description: 'Learn to deploy AI chatbots that answer common new hire questions 24/7.',
          type: 'video',
          duration: '16:45',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'AI chatbots are invaluable during onboarding. New employees often have repetitive questions about policies, benefits, and procedures. An AI chatbot can handle these queries instantly, any time of day, freeing up HR staff for more complex issues.',
          notes: 'Chatbot implementation steps:\n1. Gather common new hire questions\n2. Build knowledge base\n3. Train the chatbot model\n4. Integrate with Slack/Teams\n5. Monitor and improve',
        },
        {
          id: 'l-3-3',
          title: 'Measuring Onboarding Success',
          description: 'Use AI analytics to measure and optimize onboarding effectiveness with real-time data.',
          type: 'video',
          duration: '15:10',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Measuring onboarding success goes beyond surveys. AI analytics can track engagement patterns, learning completion rates, time-to-productivity, and early attrition signals. This data helps HR continuously improve the onboarding experience.',
          notes: 'Key metrics:\n• Time to full productivity\n• 90-day retention rate\n• New hire satisfaction scores\n• Training completion rates\n• Buddy/mentor engagement',
        },
        {
          id: 'l-3-4',
          title: 'Chapter 3 Knowledge Check',
          description: 'Verify your understanding of AI-powered onboarding.',
          type: 'quiz',
          duration: '5:00',
          quizQuestions: [
            {
              question: 'What is the main advantage of AI-driven onboarding?',
              options: [
                'It eliminates the need for HR involvement',
                'It creates personalized experiences for each new hire',
                'It only handles paperwork',
                'It works only for remote employees',
              ],
              correctIndex: 1,
              explanation: 'AI-driven onboarding personalizes the journey based on role, department, and individual needs.',
            },
            {
              question: 'Which metric best measures onboarding success?',
              options: [
                'Number of forms signed',
                'Time to full productivity',
                'Office decoration budget',
                'Number of welcome emails sent',
              ],
              correctIndex: 1,
              explanation: 'Time to full productivity is a key indicator of effective onboarding — how quickly a new hire becomes a contributing team member.',
            },
          ],
        },
      ],
    },
    {
      id: 'ch-4',
      title: 'Performance Management & AI',
      lessons: [
        {
          id: 'l-4-1',
          title: 'Continuous Feedback Systems',
          description: 'Move beyond annual reviews with AI-powered continuous feedback and real-time performance insights.',
          type: 'video',
          duration: '21:15',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Traditional annual performance reviews are being replaced by continuous feedback systems. AI can aggregate feedback from multiple sources — peers, managers, projects — to create a holistic, real-time performance picture. This reduces recency bias and provides more actionable insights.',
          notes: 'Benefits of continuous feedback:\n• Reduces recency bias\n• Provides real-time coaching opportunities\n• Increases employee engagement\n• Better alignment with goals',
        },
        {
          id: 'l-4-2',
          title: 'Predictive Performance Analytics',
          description: 'Leverage AI to predict employee performance trajectories and identify intervention points.',
          type: 'video',
          duration: '23:40',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Predictive analytics uses historical data and machine learning to forecast future performance. By analyzing patterns in feedback, project outcomes, and skill development, AI can identify employees who may need additional support or are ready for advancement.',
          notes: 'Data sources for prediction:\n• Historical performance reviews\n• Project completion rates\n• Skill assessment scores\n• Engagement survey results\n• Attendance patterns',
        },
        {
          id: 'l-4-3',
          title: 'Reducing Bias in Performance Reviews',
          description: 'How AI can help identify and mitigate unconscious bias in performance evaluations.',
          type: 'video',
          duration: '17:50',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Unconscious bias in performance reviews is a well-documented problem. AI tools can analyze review language for bias indicators, compare ratings across demographic groups, and flag inconsistencies. This helps create fairer, more equitable performance evaluations.',
          notes: 'Common biases AI can detect:\n• Gender bias in language\n• Halo/horn effect\n• Recency bias\n• Similarity bias\n• Attribution bias',
        },
        {
          id: 'l-4-4',
          title: 'Performance Management Quiz',
          description: 'Test your knowledge of AI in performance management.',
          type: 'quiz',
          duration: '5:00',
          quizQuestions: [
            {
              question: 'Why is continuous feedback preferred over annual reviews?',
              options: [
                'It takes less effort',
                'It reduces bias and provides timely insights',
                'It is legally required',
                'Employees prefer fewer meetings',
              ],
              correctIndex: 1,
              explanation: 'Continuous feedback reduces recency bias, provides timely coaching, and keeps employees aligned with goals throughout the year.',
            },
            {
              question: 'What can predictive analytics identify in performance management?',
              options: [
                'Employee lunch preferences',
                'Future performance trajectories and intervention points',
                'Office temperature settings',
                'Parking assignments',
              ],
              correctIndex: 1,
              explanation: 'Predictive analytics uses historical patterns to forecast performance trajectories and identify when employees may need support or are ready for growth.',
            },
          ],
        },
      ],
    },
    {
      id: 'ch-5',
      title: 'Employee Engagement & Retention',
      lessons: [
        {
          id: 'l-5-1',
          title: 'Sentiment Analysis for Employee Engagement',
          description: 'Use AI sentiment analysis to gauge real-time employee morale from communication patterns.',
          type: 'video',
          duration: '20:00',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Sentiment analysis applies NLP to employee communications — emails, chat messages, survey responses — to gauge morale and engagement levels. This provides HR with real-time insights into team health without requiring lengthy surveys.',
          notes: 'Applications:\n• Analyze Slack/Teams sentiment\n• Process open-ended survey responses\n• Monitor email tone patterns\n• Track engagement trends over time',
        },
        {
          id: 'l-5-2',
          title: 'Predictive Attrition Modeling',
          description: 'Build AI models that predict which employees are at risk of leaving, and why.',
          type: 'video',
          duration: '24:20',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Employee turnover is expensive. Predictive attrition models analyze factors like engagement scores, tenure, compensation, manager relationships, and career progression to identify flight risks. Early identification enables proactive retention strategies.',
          notes: 'Key attrition predictors:\n• Declining engagement scores\n• Lack of promotion opportunities\n• Compensation below market rate\n• Manager relationship quality\n• Work-life balance indicators',
        },
        {
          id: 'l-5-3',
          title: 'Personalized Retention Strategies',
          description: 'Design AI-driven personalized retention programs based on individual employee needs and preferences.',
          type: 'video',
          duration: '18:30',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'One-size-fits-all retention programs are outdated. AI enables personalization by understanding what each employee values — whether it is career growth, compensation, flexibility, or learning opportunities. Tailored interventions are far more effective.',
          notes: 'Personalization factors:\n• Individual career goals\n• Learning preferences\n• Work style preferences\n• Compensation expectations\n• Life stage considerations',
        },
        {
          id: 'l-5-4',
          title: 'Chapter 5 Knowledge Check',
          description: 'Test your understanding of AI in employee engagement and retention.',
          type: 'quiz',
          duration: '5:00',
          quizQuestions: [
            {
              question: 'What does employee sentiment analysis measure?',
              options: [
                'Physical health metrics',
                'Emotional tone and engagement from communications',
                'Office noise levels',
                'Commute times',
              ],
              correctIndex: 1,
              explanation: 'Sentiment analysis uses NLP to measure the emotional tone in employee communications, providing real-time engagement insights.',
            },
            {
              question: 'Why is personalized retention more effective than generic programs?',
              options: [
                'It is cheaper to implement',
                'It addresses individual needs and values',
                'It requires less HR involvement',
                'It is mandated by law',
              ],
              correctIndex: 1,
              explanation: 'Personalized retention strategies address what each individual employee values, making interventions far more impactful than one-size-fits-all approaches.',
            },
          ],
        },
      ],
    },
    {
      id: 'ch-6',
      title: 'HR Analytics & Data-Driven Decisions',
      lessons: [
        {
          id: 'l-6-1',
          title: 'Building an HR Analytics Dashboard',
          description: 'Learn to create comprehensive HR dashboards powered by AI insights.',
          type: 'video',
          duration: '26:00',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'An effective HR analytics dashboard brings together key workforce metrics in a visual, actionable format. AI enhances dashboards by providing predictive insights, anomaly detection, and automated recommendations.',
          notes: 'Dashboard components:\n• Headcount & demographics\n• Turnover rates & predictions\n• Engagement scores\n• Hiring pipeline metrics\n• Training ROI\n• Compensation benchmarking',
        },
        {
          id: 'l-6-2',
          title: 'Workforce Planning with AI',
          description: 'Use AI to forecast hiring needs, skill gaps, and organizational capacity.',
          type: 'video',
          duration: '22:45',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'AI-powered workforce planning goes beyond headcount forecasting. It analyzes business growth projections, skill gap analyses, retirement waves, and market trends to create dynamic workforce plans that adapt to changing conditions.',
          notes: 'Planning inputs:\n• Business growth projections\n• Current skill inventory\n• Industry trend analysis\n• Attrition predictions\n• Training pipeline capacity',
        },
        {
          id: 'l-6-3',
          title: 'Ethical AI in HR',
          description: 'Navigate the ethical considerations of using AI in people management and decision-making.',
          type: 'video',
          duration: '19:30',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          transcript: 'Ethical AI in HR is not optional — it is essential. Organizations must ensure fairness, transparency, and accountability in AI-driven HR decisions. This includes regular bias audits, explainable AI models, and clear governance frameworks.',
          notes: 'Ethical principles:\n• Fairness and non-discrimination\n• Transparency in AI decisions\n• Employee consent and privacy\n• Human oversight\n• Regular bias audits\n• Explainable models',
        },
        {
          id: 'l-6-4',
          title: 'Final Assessment',
          description: 'Comprehensive assessment covering all course topics on AI in HR.',
          type: 'quiz',
          duration: '15:00',
          quizQuestions: [
            {
              question: 'Which is the most important factor when implementing AI in HR?',
              options: [
                'Cost of the AI tool',
                'Ethical considerations and employee trust',
                'Speed of implementation',
                'Brand of the AI vendor',
              ],
              correctIndex: 1,
              explanation: 'Ethical considerations and employee trust are paramount. Without these, AI implementations face resistance and can cause harm.',
            },
            {
              question: 'What makes a good HR analytics dashboard?',
              options: [
                'As many charts as possible',
                'Actionable insights with predictive capabilities',
                'Only financial metrics',
                'Real-time employee tracking',
              ],
              correctIndex: 1,
              explanation: 'A good HR dashboard focuses on actionable insights with predictive capabilities, not just data visualization.',
            },
            {
              question: 'How should organizations approach AI bias?',
              options: [
                'Ignore it — AI is inherently fair',
                'Conduct regular audits and implement fairness constraints',
                'Only test once during implementation',
                'Leave it to the AI vendor to fix',
              ],
              correctIndex: 1,
              explanation: 'Organizations must proactively conduct regular bias audits and implement fairness constraints to ensure equitable AI outcomes.',
            },
            {
              question: 'What is the biggest challenge in AI workforce planning?',
              options: [
                'Lack of data',
                'Balancing predictions with human judgment and market uncertainty',
                'Too much computing power',
                'Employee resistance to planning',
              ],
              correctIndex: 1,
              explanation: 'The biggest challenge is balancing AI predictions with human judgment, especially when market conditions and human behavior are inherently uncertain.',
            },
          ],
        },
      ],
    },
  ],
};
