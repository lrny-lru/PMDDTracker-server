const express = require("express");
const xss = require("xss");
const tuckService = require("./tuck-service");

const tuckRouter = express.Router();
const bodyParser = express.json();

const serializeSymptom = (symptom) => ({
  id: symptom.id,
  date: symptom.date,
  name: xss(symptom.name),
  severity: symptom.severity,
  description: xss(symptom.description),
});

tuckRouter
  .route("/symptoms")
  .get((req, res, next) => {
    tuckService
      .getAllSymptoms(req.app.get("db"))
      .then((symptoms) => {
        res.json(symptoms.map(serializeSymptom));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name", "severity", "description"]) {
      if (!req.body[field]) {
        console.error(`${field} is required`);
        res.status(400)
      }
    }

    const { severity, name, description } = req.body;
    const newSymptom = { severity, name, description };

    tuckService
      .insertSymptom(req.app.get("db"), newSymptom)
      .then((symptom) => {
        console.log(`new symptom with id ${symptom.id} was created`);
        res
          .status(201)
          .location(`/symptoms/${symptom.id}`)
          .json(serializeSymptom(symptom));
      })
      .catch(next);
  });

tuckRouter
  .route("/symptoms/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    tuckService
      .getSymptomById(req.app.get("db"), id)
      .then((symptom) => {
        if (!symptom) {
          console.error(`No symptom matching the id, ${id} was found.`);
          return res.status(404).json({
            error: { message: "Symptom not found" },
          });
        }
        res.symptom = symptom;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeSymptom(res.symptom));
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    tuckService
      .deleteSymptom(req.app.get("db"), id)
      .then((shifted) => {
        console.log(`Symptom with id of ${id} was deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { severity, name, description } = req.body;
    const updateSymptom = { severity, name, description }

    tuckService.updateSymptom(
        req.app.get('db'),
        req.params.id,
        updateSymptom
    )
    .then(rowsAffected => {
        res.status(204).end()
    })
    .catch(next)
  })

module.exports = tuckRouter;
