const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const titleExists = repositories.some((repo) => repo.title === title);

  if (titleExists) {
    return response.status(404).json({ error: 'Title already exists!' });
  }

  repositories.push({
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  });

  return response.status(201).json(repositories);
});

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const repository = {
    ...repositories[repositoryIndex],
    ...{ title, url, techs },
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json(likes);
});

module.exports = app;
