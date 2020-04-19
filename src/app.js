const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');


const app = express();

app.use(express.json());
app.use(cors());





const repositories = [];


function validateProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Id is not found' })
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newProject = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(newProject);

  return response.json(newProject);

});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;
  const positionRepositorieArray = repositories.findIndex(repositorie => repositorie.id === id);

  repositories[positionRepositorieArray].title = title
  repositories[positionRepositorieArray].url = url
  repositories[positionRepositorieArray].techs = techs

  return response.json(repositories[positionRepositorieArray]);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const positionRepositorieArray = repositories.findIndex(repositorie => repositorie.id === id);
  repositories.splice(positionRepositorieArray, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;
  const positionRepositorieArray = repositories.findIndex(repositorie => repositorie.id === id);
  const numberlikes = repositories[positionRepositorieArray].likes + 1;
  repositories[positionRepositorieArray].likes = numberlikes

  return response.json(repositories[positionRepositorieArray])
});

module.exports = app;
