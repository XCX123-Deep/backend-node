const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createTestUsers() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar usuarios anteriores (opcional)
    // await User.deleteMany({});

    // Crear usuarios de prueba
    const testUsers = [
      {
        username: 'juan',
        email: 'juan@example.com',
        password: 'password123',
        role: 'Residente'
      },
      {
        username: 'maria',
        email: 'maria@example.com',
        password: 'password123',
        role: 'Administrador'
      },
      {
        username: 'carlos',
        email: 'carlos@example.com',
        password: 'password123',
        role: 'Portero'
      }
    ];

    for (const userData of testUsers) {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ username: userData.username });
      
      if (existingUser) {
        console.log(`⚠️  Usuario "${userData.username}" ya existe`);
        continue;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear usuario
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
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
