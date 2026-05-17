require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const redisClient = require('./redisClient');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

const checkCache = (key) => async (req, res, next) => {
  try {
    if (!redisClient.isOpen) {
      return next();
    }
    const data = await redisClient.get(key);
    if (data) {
      return res.json(JSON.parse(data));
    }
    next();
  } catch (error) {
    console.error('Redis error:', error);
    next();
  }
};

const invalidateCache = async (keys) => {
  if (!redisClient.isOpen) return;
  for (let key of keys) {
    await redisClient.del(key);
  }
};

app.get('/api/dosen', checkCache('dosen'), async (req, res) => {
  try {
    const dosen = await prisma.dosen.findMany();
    if (redisClient.isOpen) await redisClient.set('dosen', JSON.stringify(dosen), { EX: 3600 });
    res.json(dosen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dosen', async (req, res) => {
  try {
    const { nama, nidn } = req.body;
    const newDosen = await prisma.dosen.create({ data: { nama, nidn } });
    await invalidateCache(['dosen', 'mahasiswa']);
    res.json(newDosen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/dosen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nidn } = req.body;
    const updated = await prisma.dosen.update({
      where: { id },
      data: { nama, nidn }
    });
    await invalidateCache(['dosen', 'mahasiswa']);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/dosen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dosen.delete({ where: { id } });
    await invalidateCache(['dosen', 'mahasiswa']);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/mahasiswa', checkCache('mahasiswa'), async (req, res) => {
  try {
    const mhs = await prisma.mahasiswa.findMany({ include: { dosen: true } });
    if (redisClient.isOpen) await redisClient.set('mahasiswa', JSON.stringify(mhs), { EX: 3600 });
    res.json(mhs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mahasiswa', async (req, res) => {
  try {
    const { nama, nim, dosenId } = req.body;
    const newMhs = await prisma.mahasiswa.create({ 
      data: { nama, nim, dosenId: dosenId || null } 
    });
    await invalidateCache(['mahasiswa']);
    res.json(newMhs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/mahasiswa/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nim, dosenId } = req.body;
    const updated = await prisma.mahasiswa.update({
      where: { id },
      data: { nama, nim, dosenId: dosenId || null }
    });
    await invalidateCache(['mahasiswa']);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/mahasiswa/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mahasiswa.delete({ where: { id } });
    await invalidateCache(['mahasiswa']);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
