require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./src/models/Question');
const User = require('./src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const sampleQuestions = [
  {
    title: 'Center a Box',
    description: 'Use CSS Flexbox to center the box both horizontally and vertically inside the container.',
    topic: 'css',
    difficulty: 'beginner',
    points: 5,
    hints: ['Use display: flex', 'Try justify-content and align-items properties'],
    initialHTML: '<div class="container">\n  <div class="box"></div>\n</div>',
    expectedCSS: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n}',
    status: 'active'
  },
  {
    title: 'Change Text Color',
    description: 'Make the heading text color blue using CSS.',
    topic: 'css',
    difficulty: 'beginner',
    points: 5,
    hints: ['Use the color property', 'Color value can be blue or #0000ff'],
    initialHTML: '<h1 class="heading">Hello World</h1>',
    expectedCSS: '.heading {\n  color: blue;\n}',
    status: 'active'
  },
  {
    title: 'Add Border Radius',
    description: 'Make the box corners rounded with a 10px border radius.',
    topic: 'css',
    difficulty: 'beginner',
    points: 5,
    hints: ['Use border-radius property'],
    initialHTML: '<div class="box"></div>',
    expectedCSS: '.box {\n  border-radius: 10px;\n}',
    status: 'active'
  },
  {
    title: 'Create Flexbox Row',
    description: 'Arrange the three boxes in a horizontal row with space between them.',
    topic: 'css',
    difficulty: 'medium',
    points: 10,
    hints: ['Use display: flex', 'Use justify-content: space-between'],
    initialHTML: '<div class="container">\n  <div class="box">1</div>\n  <div class="box">2</div>\n  <div class="box">3</div>\n</div>',
    expectedCSS: '.container {\n  display: flex;\n  justify-content: space-between;\n}',
    status: 'active'
  },
  {
    title: 'CSS Grid Layout',
    description: 'Create a 2-column grid layout with a 20px gap.',
    topic: 'css',
    difficulty: 'medium',
    points: 10,
    hints: ['Use display: grid', 'Use grid-template-columns', 'Use gap property'],
    initialHTML: '<div class="grid">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n</div>',
    expectedCSS: '.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n}',
    status: 'active'
  },
  {
    title: 'Hover Effect',
    description: 'Add a hover effect that changes the background color to red.',
    topic: 'css',
    difficulty: 'medium',
    points: 10,
    hints: ['Use :hover pseudo-class', 'Change background property'],
    initialHTML: '<button class="btn">Hover Me</button>',
    expectedCSS: '.btn:hover {\n  background: red;\n}',
    status: 'active'
  },
  {
    title: 'CSS Animation',
    description: 'Create a fade-in animation that lasts 2 seconds.',
    topic: 'css',
    difficulty: 'advanced',
    points: 20,
    hints: ['Use @keyframes', 'Use animation property', 'Animate opacity from 0 to 1'],
    initialHTML: '<div class="fade-in">Hello</div>',
    expectedCSS: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.fade-in {\n  animation: fadeIn 2s;\n}',
    status: 'active'
  },
  {
    title: 'Responsive Design',
    description: 'Make the container width 100% on mobile (max-width: 768px) and 50% on desktop.',
    topic: 'css',
    difficulty: 'advanced',
    points: 20,
    hints: ['Use @media query', 'Set width for different screen sizes'],
    initialHTML: '<div class="container">Content</div>',
    expectedCSS: '.container {\n  width: 50%;\n}\n\n@media (max-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}',
    status: 'active'
  },
  {
    title: 'HTML Form Structure',
    description: 'Create a form with an email input and submit button.',
    topic: 'html',
    difficulty: 'beginner',
    points: 5,
    hints: ['Use <form> tag', 'Use <input type="email">', 'Use <button> tag'],
    initialHTML: '',
    expectedCSS: '<form>\n  <input type="email" placeholder="Email">\n  <button type="submit">Submit</button>\n</form>',
    status: 'active'
  },
  {
    title: 'Semantic HTML',
    description: 'Use semantic HTML5 tags to structure a page with header, main content, and footer.',
    topic: 'html',
    difficulty: 'medium',
    points: 10,
    hints: ['Use <header>, <main>, <footer> tags'],
    initialHTML: '',
    expectedCSS: '<header>Header</header>\n<main>Main Content</main>\n<footer>Footer</footer>',
    status: 'active'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: 'admin@codelinkers.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@codelinkers.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('👤 Created admin user');
      console.log('   Email: admin@codelinkers.com');
      console.log('   Password: admin123');
    }

    // Add admin ID to questions
    const questionsWithAdmin = sampleQuestions.map(q => ({
      ...q,
      createdBy: admin._id
    }));

    // Insert sample questions
    await Question.insertMany(questionsWithAdmin);
    console.log(`✅ Added ${sampleQuestions.length} sample questions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Admin user: admin@codelinkers.com / admin123`);
    console.log(`   - Questions: ${sampleQuestions.length}`);
    console.log(`   - Beginner: ${sampleQuestions.filter(q => q.difficulty === 'beginner').length}`);
    console.log(`   - Medium: ${sampleQuestions.filter(q => q.difficulty === 'medium').length}`);
    console.log(`   - Advanced: ${sampleQuestions.filter(q => q.difficulty === 'advanced').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
