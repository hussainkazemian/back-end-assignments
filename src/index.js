import http from 'http';

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Handle GET request
  if (method === 'GET' && url === '/api/items') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
  // Handle POST request
  else if (method === 'POST' && url === '/api/items') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = data.length + 1;
      data.push(newItem);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
    });
  }
  // Handle DELETE request
  else if (method === 'DELETE' && url.startsWith('/api/items/')) {
    const id = parseInt(url.split('/')[3]);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }
  }
  // Handle PUT request
  else if (method === 'PUT' && url.startsWith('/api/items/')) {
    const id = parseInt(url.split('/')[3]);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const updatedItem = JSON.parse(body);
        data[index] = { id, ...updatedItem };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data[index]));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }
  }
  // Handle 404 for non-existing resources
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
