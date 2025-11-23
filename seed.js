// Script para crear usuarios de prueba
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const testUsers = [
      { username: 'juan', email: 'juan@example.com', password: 'password123', role: 'Residente' },
      { username: 'maria', email: 'maria@example.com', password: 'password123', role: 'Administrador' },
      { username: 'carlos', email: 'carlos@example.com', password: 'password123', role: 'Portero' }
    ];

    for (const userData of testUsers) {
      const existing = await User.findOne({ username: userData.username });
      if (existing) {
        console.log(`⚠️  Usuario "${userData.username}" ya existe`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      await user.save();
      console.log(`✅ Usuario creado: ${userData.username} (${userData.role})`);
    }

    console.log('\n✨ ¡Usuarios de prueba creados exitosamente!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
