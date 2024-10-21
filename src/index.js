import express from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Dummy data storage
let data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

// Get all data
app.get('/api/items', (req, res) => {
  res.json(data);
});

// Add new data
app.post('/api/items', (req, res) => {
  const newItem = { id: data.length + 1, ...req.body };
  data.push(newItem);
  res.status(201).json(newItem);
});

// Delete data
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = data.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    data.splice(index, 1);
    res.status(204).send(); // No content
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Modify existing data
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = data.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    res.json(data[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Handle non-existing resources
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
