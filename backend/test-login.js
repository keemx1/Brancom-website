fetch('http://localhost:5000/api/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ foo: 'bar', hello: 'world' })
})
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);