const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'Residente'
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validaciones
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Usuario, contraseña y rol son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar que el rol coincida
    if (user.role !== role) {
      return res.status(403).json({ error: 'El rol no coincide con el usuario' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar token (para hacer login con biometría)
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Token válido',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Endpoint para crear usuarios de prueba (solo desarrollo)
router.post('/seed', async (req, res) => {
  try {
    const testUsers = [
      { username: 'juan', email: 'juan@example.com', password: 'password123', role: 'Residente' },
      { username: 'maria', email: 'maria@example.com', password: 'password123', role: 'Administrador' },
      { username: 'carlos', email: 'carlos@example.com', password: 'password123', role: 'Portero' }
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      const existing = await User.findOne({ username: userData.username });
      if (existing) {
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
      createdUsers.push({
        username: userData.username,
        role: userData.role,
        password: userData.password // Mostrar solo para prueba
      });
    }

    res.json({
      message: 'Usuarios de prueba creados',
      users: createdUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
