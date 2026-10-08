import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Program from '../models/Program.js';
import Session from '../models/Session.js';
import AIKnowledge from '../models/AIKnowledge.js';
import Insight from '../models/Insight.js';
import Opportunity from '../models/Opportunity.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // ─── SUPER ADMIN ────────────────────────────────────────────────────────
    const existingAdmin = await Admin.findOne({ role: 'SUPER_ADMIN' });
    if (!existingAdmin) {
      await Admin.create({
        username: process.env.SUPER_ADMIN_USERNAME || 'superadmin',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@aviox.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'Aviox@SuperAdmin2024',
        role: 'SUPER_ADMIN',
        isApproved: true,
        isActive: true,
        registrationStatus: 'approved',
      });
      console.log('✅ Super Admin created:');
      console.log(`   Email: ${process.env.SUPER_ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.SUPER_ADMIN_PASSWORD}`);
    } else {
      console.log('ℹ️  Super Admin already exists. Skipping.');
    }

    // ─── PROGRAMS ───────────────────────────────────────────────────────────
    const programCount = await Program.countDocuments();
    if (programCount === 0) {
      const programs = [
        { title: 'Artificial Intelligence', shortDescription: 'Build intelligent systems with AI fundamentals and practical applications.', description: 'Explore the world of Artificial Intelligence — from neural networks to deep learning, computer vision, and natural language processing. Build real-world AI systems that solve industry problems.', icon: 'Brain', category: 'Technology', duration: '3 Months', level: 'Intermediate', skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'], order: 1 },
        { title: 'AI Tools & Automation', shortDescription: 'Master the latest AI tools to supercharge your productivity.', description: 'Learn to leverage cutting-edge AI tools — ChatGPT, Midjourney, Notion AI, and more — to automate workflows and boost your productivity by 10x.', icon: 'Zap', category: 'Technology', duration: '4 Weeks', level: 'Beginner', skills: ['ChatGPT', 'Prompt Engineering', 'Automation', 'Workflow Design'], order: 2 },
        { title: 'Prompt Engineering', shortDescription: 'The art and science of communicating with AI systems.', description: 'Master the craft of prompt engineering to build powerful AI-driven applications. Learn structured prompting, chain-of-thought reasoning, and advanced techniques for LLMs.', icon: 'MessageSquare', category: 'Technology', duration: '3 Weeks', level: 'All Levels', skills: ['LLM Optimization', 'Chain-of-Thought', 'RAG Systems', 'AI Applications'], order: 3 },
        { title: 'MERN Stack Development', shortDescription: 'Full-stack web development with MongoDB, Express, React, and Node.js.', description: 'Build production-grade full-stack applications with the MERN stack. From backend APIs to dynamic frontends, learn the complete web development ecosystem used by top companies.', icon: 'Code', category: 'Development', duration: '4 Months', level: 'Intermediate', skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'], order: 4 },
        { title: 'Cybersecurity', shortDescription: 'Defend, detect, and respond to modern cyber threats.', description: 'Enter the high-demand world of cybersecurity. Learn ethical hacking, penetration testing, network security, and build the skills to protect organizations from cyber attacks.', icon: 'Shield', category: 'Security', duration: '3 Months', level: 'Intermediate', skills: ['Ethical Hacking', 'Network Security', 'Penetration Testing', 'SIEM'], order: 5 },
        { title: 'UI/UX Design', shortDescription: 'Design products that users love with modern design principles.', description: 'Master the complete UI/UX design process — from user research and wireframing to high-fidelity prototypes and design systems. Create experiences that are beautiful and intuitive.', icon: 'Palette', category: 'Design', duration: '2 Months', level: 'Beginner', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], order: 6 },
        { title: 'Data Science', shortDescription: 'Turn raw data into powerful business insights.', description: 'Learn data science from fundamentals to advanced analytics. Master Python, pandas, visualization, statistical analysis, and machine learning to drive data-driven decisions.', icon: 'BarChart', category: 'Technology', duration: '4 Months', level: 'Intermediate', skills: ['Python', 'Pandas', 'Statistics', 'Data Visualization', 'ML'], order: 7 },
        { title: 'Cloud Technologies', shortDescription: 'Build and deploy scalable applications on the cloud.', description: 'Master cloud infrastructure with AWS, Google Cloud, and Azure. Learn cloud architecture, DevOps practices, containerization with Docker and Kubernetes, and CI/CD pipelines.', icon: 'Cloud', category: 'Technology', duration: '3 Months', level: 'Intermediate', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'], order: 8 },
        { title: 'Communication Skills', shortDescription: 'Professional communication for the modern tech workplace.', description: 'Develop powerful communication skills for technical professionals — from presenting ideas confidently and writing clearly to leading meetings and building professional relationships.', icon: 'Users', category: 'Career', duration: '6 Weeks', level: 'All Levels', skills: ['Presentation', 'Technical Writing', 'Leadership', 'Networking'], order: 9 },
        { title: 'Career Development', shortDescription: 'Your roadmap from student to industry professional.', description: 'Build your personal brand, craft an ATS-optimized resume, master technical interviews, and develop the career strategy to land your dream job in tech. Mentorship-driven program.', icon: 'TrendingUp', category: 'Career', duration: '6 Weeks', level: 'All Levels', skills: ['Resume Building', 'Interview Prep', 'LinkedIn', 'Job Strategy'], order: 10 },
      ];
      await Program.insertMany(programs);
      console.log('✅ Programs seeded.');
    }

    // ─── SESSIONS ───────────────────────────────────────────────────────────
    const sessionCount = await Session.countDocuments();
    if (sessionCount === 0) {
      const now = new Date();
      const sessions = [
        { title: 'AI & The Future of Work', description: 'An interactive session exploring how AI is reshaping industries and what skills professionals need to stay ahead.', date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), time: '7:00 PM IST', duration: '90 min', availableSlots: 50, totalSlots: 50, instructor: 'AVIOX Expert', instructorTitle: 'AI Research Lead', category: 'Artificial Intelligence', status: 'upcoming', tags: ['AI', 'Career', 'Future'] },
        { title: 'MERN Stack Masterclass', description: 'Build a complete production-ready application from scratch. Covers React, Node, MongoDB and deployment.', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), time: '6:30 PM IST', duration: '2 hours', availableSlots: 40, totalSlots: 40, instructor: 'AVIOX Dev Team', instructorTitle: 'Senior Full-Stack Engineer', category: 'Development', status: 'upcoming', tags: ['MERN', 'Web Development', 'Coding'] },
        { title: 'Career Strategy Workshop', description: 'Map your path from student to industry professional. Resume, LinkedIn, interview prep and networking strategies.', date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), time: '5:00 PM IST', duration: '2 hours', availableSlots: 60, totalSlots: 60, instructor: 'AVIOX Career Team', instructorTitle: 'Career Development Coach', category: 'Career', status: 'upcoming', tags: ['Career', 'Resume', 'Interview'] },
      ];
      await Session.insertMany(sessions);
      console.log('✅ Sessions seeded.');
    }

    // ─── AI KNOWLEDGE ───────────────────────────────────────────────────────
    const aiCount = await AIKnowledge.countDocuments();
    if (aiCount === 0) {
      const knowledge = [
        { topic: 'About AVIOX', keywords: ['aviox', 'about', 'what', 'platform', 'company', 'who', 'mission', 'vision'], content: 'AVIOX is a premium student career-development and technology platform with the mission "Study Beyond Degrees." We empower students with practical skills, emerging technologies, career guidance, and real-world opportunities to build a future beyond their degree. Founded to bridge the gap between education and industry, AVIOX offers programs, live sessions, career mentorship, and community-driven growth.', category: 'About', actionButtons: [{ label: 'Explore Programs', action: 'navigate', url: '/#programs' }, { label: 'Book a Session', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20want%20to%20know%20more%20about%20your%20programs.' }], priority: 10 },
        { topic: 'Programs Overview', keywords: ['programs', 'courses', 'learn', 'study', 'curriculum', 'training', 'what courses', 'offer'], content: 'AVIOX offers 10 specialized programs designed for the modern career landscape:\n\n1. Artificial Intelligence\n2. AI Tools & Automation\n3. Prompt Engineering\n4. MERN Stack Development\n5. Cybersecurity\n6. UI/UX Design\n7. Data Science\n8. Cloud Technologies\n9. Communication Skills\n10. Career Development\n\nAll programs are designed to be practical, industry-aligned, and delivered by experts.', category: 'Programs', actionButtons: [{ label: 'View All Programs', action: 'navigate', url: '/#programs' }, { label: 'Enroll Now', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20enrolling%20in%20a%20program.' }], priority: 9 },
        { topic: 'Session Booking', keywords: ['book', 'session', 'register', 'slot', 'booking', 'join', 'attend', 'enroll session'], content: 'To book a session with AVIOX, you can:\n\n1. Visit the Sessions section on our website\n2. Click "Book Slot" on any upcoming session\n3. You\'ll be connected to our WhatsApp where our team will confirm your registration\n\nAlternatively, message us on WhatsApp at +91 8921757960 and mention the session you\'re interested in.', category: 'Booking', actionButtons: [{ label: 'View Sessions', action: 'navigate', url: '/#sessions' }, { label: 'Book via WhatsApp', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20would%20like%20to%20book%20a%20session.' }], priority: 9 },
        { topic: 'Contact Information', keywords: ['contact', 'reach', 'email', 'whatsapp', 'phone', 'support', 'help', 'talk'], content: 'You can reach AVIOX through:\n\n📧 Email: futureaviox@gmail.com\n📱 WhatsApp: +91 8921757960\n\nOur team is available to help you with program enquiries, session bookings, career guidance, and any support you need. We typically respond within a few hours.', category: 'Contact', actionButtons: [{ label: 'WhatsApp Us', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20need%20some%20help.' }, { label: 'Email Us', action: 'email', url: 'mailto:futureaviox@gmail.com' }], priority: 8 },
        { topic: 'Career Guidance', keywords: ['career', 'job', 'placement', 'guidance', 'future', 'path', 'industry', 'professional'], content: 'AVIOX provides comprehensive career development support:\n\n• Personalized career roadmaps\n• Resume building and ATS optimization\n• LinkedIn profile makeovers\n• Mock interview preparation\n• Industry mentorship\n• Job and internship opportunities\n• Networking with industry professionals\n\nOur Career Development program is specifically designed to take you from student to industry professional.', category: 'Career', actionButtons: [{ label: 'Career Program', action: 'navigate', url: '/#programs' }, { label: 'Book Career Session', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20need%20career%20guidance.' }], priority: 8 },
        { topic: 'Internships and Jobs', keywords: ['internship', 'job', 'opportunity', 'work', 'hire', 'placement', 'apply', 'company'], content: 'AVIOX connects students with real industry opportunities:\n\n• Internship placements with partner companies\n• Job openings across tech domains\n• Workshop opportunities\n• Industry programs and collaborations\n• Career fairs and networking events\n\nCheck the Opportunities section on our platform for the latest listings, or reach out to us on WhatsApp for personalized placement support.', category: 'Internships', actionButtons: [{ label: 'View Opportunities', action: 'navigate', url: '/#opportunities' }, { label: 'Get Help', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20looking%20for%20internship%20or%20job%20opportunities.' }], priority: 7 },
        { topic: 'AI Learning', keywords: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'ml', 'neural'], content: 'AVIOX\'s AI programs cover the complete AI landscape:\n\n🤖 Artificial Intelligence: Neural networks, computer vision, NLP, real-world AI projects\n⚡ AI Tools: ChatGPT, Midjourney, automation tools, productivity workflows\n💬 Prompt Engineering: LLM optimization, chain-of-thought, RAG systems\n\nAll AI programs are led by practicing AI professionals and include hands-on project work.', category: 'Programs', actionButtons: [{ label: 'AI Programs', action: 'navigate', url: '/#programs' }, { label: 'Enroll in AI', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20AI%20programs.' }], priority: 7 },
        { topic: 'MERN Stack Development', keywords: ['mern', 'react', 'node', 'mongodb', 'express', 'javascript', 'fullstack', 'web development', 'coding'], content: 'Our MERN Stack Development program covers full-stack web development:\n\n• MongoDB — NoSQL database design\n• Express.js — RESTful API development\n• React — Modern frontend development with TypeScript\n• Node.js — Server-side JavaScript\n• Additional: TypeScript, Tailwind CSS, JWT Auth, Deployment\n\nDuration: 4 Months | Level: Intermediate\nBuild 5+ real-world projects throughout the program.', category: 'Programs', actionButtons: [{ label: 'MERN Program', action: 'navigate', url: '/#programs' }, { label: 'Join MERN', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20MERN%20Stack%20program.' }], priority: 7 },
        { topic: 'Support and Tickets', keywords: ['support', 'ticket', 'issue', 'problem', 'help', 'raise', 'complaint', 'query'], content: 'If you need support, AVIOX offers multiple ways to get help:\n\n1. Raise a Support Ticket: Login to your dashboard and create a ticket with your issue. Our team will respond within 24 hours.\n\n2. WhatsApp Support: Message us directly at +91 8921757960 for urgent queries.\n\n3. Email: futureaviox@gmail.com for detailed queries.\n\nTicket categories: Technical, Billing, Course, Session, Career, General', category: 'Platform', actionButtons: [{ label: 'Raise a Ticket', action: 'navigate', url: '/dashboard' }, { label: 'WhatsApp Support', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20need%20support%20regarding%20my%20issue.' }], priority: 6 },
        { topic: 'Registration and Login', keywords: ['register', 'login', 'sign up', 'account', 'signup', 'create account', 'join'], content: 'Creating an AVIOX account is free and gives you access to:\n\n• Your personal dashboard\n• Upcoming sessions and bookings\n• Opportunities board\n• Support ticket system\n• AI career assistant\n• Program resources\n\nTo register: Click "Register" in the navbar, fill in your details, and you\'re ready to go!\n\nAlready have an account? Click "Login" to access your dashboard.', category: 'Platform', actionButtons: [{ label: 'Register Now', action: 'navigate', url: '/register' }, { label: 'Login', action: 'navigate', url: '/login' }], priority: 6 },
        { topic: 'Cybersecurity Program', keywords: ['cybersecurity', 'security', 'hacking', 'ethical hacking', 'pentest', 'cyber', 'network security'], content: 'AVIOX Cybersecurity program covers:\n\n🛡️ Ethical Hacking fundamentals\n🔍 Penetration testing methodologies\n🌐 Network security and protocols\n🔐 Cryptography and secure communications\n📊 SIEM and threat intelligence\n🚨 Incident response\n\nDuration: 3 Months | Level: Intermediate\nPrepare for certifications like CEH and CompTIA Security+.', category: 'Programs', actionButtons: [{ label: 'Cybersecurity Program', action: 'navigate', url: '/#programs' }, { label: 'Enroll Now', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20Cybersecurity%20program.' }], priority: 6 },
        { topic: 'Data Science Program', keywords: ['data science', 'data', 'analytics', 'python', 'pandas', 'statistics', 'visualization'], content: 'AVIOX Data Science program covers:\n\n📊 Python for data analysis (pandas, numpy)\n📈 Data visualization (matplotlib, seaborn, plotly)\n🧮 Statistics and probability\n🤖 Machine learning with scikit-learn\n🗄️ SQL and database querying\n📉 Business intelligence and reporting\n\nDuration: 4 Months | Level: Intermediate', category: 'Programs', actionButtons: [{ label: 'Data Science Program', action: 'navigate', url: '/#programs' }, { label: 'Enroll Now', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20Data%20Science%20program.' }], priority: 5 },
        { topic: 'Fees and Pricing', keywords: ['fee', 'fees', 'price', 'cost', 'pricing', 'how much', 'payment', 'free'], content: 'For detailed pricing and fee information for our programs, please contact our team directly:\n\n📱 WhatsApp: +91 8921757960\n📧 Email: futureaviox@gmail.com\n\nWe offer flexible payment options and occasional scholarships for deserving students. Our team will provide you with a personalized fee structure based on your needs.', category: 'FAQs', actionButtons: [{ label: 'Ask on WhatsApp', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20would%20like%20to%20know%20the%20fee%20details%20for%20your%20programs.' }], priority: 5 },
        { topic: 'Certificate and Completion', keywords: ['certificate', 'certification', 'completion', 'credential', 'badge', 'degree'], content: 'Upon successful completion of AVIOX programs, you will receive:\n\n🏆 AVIOX Program Completion Certificate\n✅ Verified digital credential\n📁 Project portfolio documentation\n🤝 Industry recommendation letter (performance-based)\n\nOur certificates are recognized by our industry partners and can significantly strengthen your job applications and LinkedIn profile.', category: 'FAQs', actionButtons: [{ label: 'Explore Programs', action: 'navigate', url: '/#programs' }, { label: 'Contact Us', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20have%20a%20question%20about%20certificates.' }], priority: 4 },
      ];
      await AIKnowledge.insertMany(knowledge);
      console.log('✅ AI Knowledge Base seeded with', knowledge.length, 'entries.');
    }

    // ─── INSIGHTS ───────────────────────────────────────────────────────────
    const insightCount = await Insight.countDocuments();
    if (insightCount === 0) {
      const insights = [
        { title: 'Why AI Skills Are the Most Valuable Asset for Students in 2025', category: 'AI', description: 'Artificial Intelligence is not just a trend — it\'s the defining technology of our generation. Students who invest in AI skills now will lead the workforce for the next two decades. Here\'s why you need to start today.', image: '', author: 'AVIOX Team', readTime: '5 min read', isPublished: true, isFeatured: true, tags: ['AI', 'Career', 'Future'] },
        { title: 'From Student to Software Engineer: A Practical Roadmap', category: 'Career', description: 'Breaking into the tech industry requires more than a degree. We break down the exact roadmap — skills, projects, networking, and interviews — that transforms students into hired software engineers.', image: '', author: 'AVIOX Career Team', readTime: '8 min read', isPublished: true, isFeatured: true, tags: ['Career', 'Engineering', 'Jobs'] },
        { title: 'The MERN Stack Explained: Why It\'s the Perfect Starting Point', category: 'Technology', description: 'MongoDB, Express, React, Node — four technologies that power some of the world\'s most successful startups. Understand why the MERN stack is the gateway to full-stack development mastery.', image: '', author: 'AVIOX Dev Team', readTime: '6 min read', isPublished: true, tags: ['MERN', 'Web Development', 'Tech'] },
        { title: 'Top 10 AI Tools Every Student Should Master in 2025', category: 'AI', description: 'From ChatGPT to Midjourney, the AI tools landscape is evolving rapidly. We curate the 10 most impactful AI tools that will multiply your productivity, creativity, and career value.', image: '', author: 'AVIOX AI Team', readTime: '7 min read', isPublished: true, tags: ['AI Tools', 'Productivity', 'Tech'] },
        { title: 'Cybersecurity Careers: The Highest-Paying Path in Tech', category: 'Industry', description: 'The global cybersecurity talent shortage means exceptional opportunity for those who specialize. Explore the most in-demand cybersecurity roles, their salary ranges, and how to break in.', image: '', author: 'AVIOX Security Team', readTime: '6 min read', isPublished: true, tags: ['Cybersecurity', 'Career', 'Salary'] },
        { title: 'Why Degrees Alone No Longer Guarantee Success', category: 'Education', description: 'The era of degree-dependent employment is over. Industry leaders now prioritize skills, portfolios, and real-world experience. AVIOX was built for this new reality. Here\'s what it means for your future.', image: '', author: 'AVIOX Team', readTime: '5 min read', isPublished: true, isFeatured: true, tags: ['Education', 'Skills', 'Future'] },
      ];
      await Insight.insertMany(insights);
      console.log('✅ Insights seeded.');
    }

    // ─── OPPORTUNITIES ──────────────────────────────────────────────────────
    const oppCount = await Opportunity.countDocuments();
    if (oppCount === 0) {
      const opportunities = [
        { title: 'Full-Stack Developer Intern', company: 'TechStartup Co.', description: 'Join a fast-growing startup to build and ship real features. You\'ll work with senior engineers on the MERN stack, contribute to product decisions, and gain mentorship in a startup environment.', category: 'Internship', location: 'Remote', stipend: '₹10,000 - ₹15,000/month', duration: '3 Months', skills: ['React', 'Node.js', 'MongoDB'], isActive: true, isFeatured: true },
        { title: 'AI Research Internship', company: 'AI Lab India', description: 'Work alongside AI researchers on cutting-edge NLP and computer vision projects. Gain hands-on experience with transformer models and contribute to publishable research.', category: 'Internship', location: 'Hybrid', stipend: '₹12,000 - ₹18,000/month', duration: '6 Months', skills: ['Python', 'TensorFlow', 'NLP'], isActive: true, isFeatured: true },
        { title: 'UI/UX Design Workshop', company: 'AVIOX', description: 'An intensive 2-day design thinking workshop where you\'ll prototype real product concepts using Figma, collaborate with a team, and present to industry judges.', category: 'Workshop', location: 'Online', skills: ['Figma', 'Design Thinking', 'Prototyping'], isActive: true },
        { title: 'Junior Cybersecurity Analyst', company: 'SecureNet', description: 'Entry-level opportunity for cybersecurity graduates and students. Support SOC operations, monitor threats, and grow your security career in a professional environment.', category: 'Job', location: 'Bangalore', skills: ['Network Security', 'SIEM', 'Linux'], isActive: true },
      ];
      await Opportunity.insertMany(opportunities);
      console.log('✅ Opportunities seeded.');
    }

    console.log('\n🎉 AVIOX Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin Credentials:');
    console.log(`  Email:    ${process.env.SUPER_ADMIN_EMAIL}`);
    console.log(`  Password: ${process.env.SUPER_ADMIN_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
