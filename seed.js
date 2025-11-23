require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
      console.error('❌ MONGODB_URI no está definida');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');

    const testUsers = [
      { username: 'juan', email: 'juan@example.com', password: 'password123', role: 'Residente' },
      { username: 'maria', email: 'maria@example.com', password: 'password123', role: 'Administrador' },
      { username: 'carlos', email: 'carlos@example.com', password: 'password123', role: 'Portero' }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of testUsers) {
      const existing = await User.findOne({ username: userData.username });
      if (existing) {
        console.log(`⚠️ Usuario "${userData.username}" ya existe`);
        skippedCount++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      console.log(`✅ Usuario creado: ${userData.username} (${userData.role})`);
      createdCount++;
    }

    console.log(`\n✨ Seed completado. Creados: ${createdCount}, existentes: ${skippedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
