const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const { expect } = require("chai");

let symptoms = [
  {
    name: "scdfv",
    severity: 3,
    description: "sdfv",
  },
  {
    name: "werfwer",
    severity: 4,
    description: "fwerfwe",
  },
  {
    name: "fwerf",
    severity: 2,
    description: "qwefd",
  },
];

describe("App", () => {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });

    app.set("db", db);
  });

  before("cleanup", () => db.raw("TRUNCATE TABLE symptoms RESTART IDENTITY;"));

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE symptoms RESTART IDENTITY;")
  );

  after("disconnect from the database", () => db.destroy());

  describe("tuck routes", () => {
    context("no symptoms in the database", () => {
      it("GET /symptoms responds with 200 containing an empty array", () => {
        return supertest(app).get("/symptoms").expect(200, []);
      });
    });
  });

  context("there are symptoms in the db", () => {
    beforeEach(() => {
      return db.insert(symptoms).into("symptoms");
    });
    it("GET /symptoms responds with 200 containing an array of objects", () => {
      return supertest(app)
        .get("/symptoms")
        .expect(200)
        .expect((res) => {
          res.body.forEach((symptom) => {
            expect(symptom).to.be.a("object");
            expect(symptom).to.include.keys(
              "id",
              "date",
              "name",
              "severity",
              "description"
            );
          });
        });
    });
  });

  context("a symptom is posted to db", () => {
    it("POST /symptoms responds with 200 and adds data provided if valid", () => {
      const newSymptom = {
        name: "werfwer",
        severity: 4,
        description: "fwerfwe",
      };
      return supertest(app)
        .post("/symptoms")
        .send(newSymptom)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "id",
            "date",
            "name",
            "severity",
            "description"
          );
          expect(res.body.name).to.eql(newSymptom.name);
          expect(res.body.severity).to.eql(newSymptom.severity);
          expect(res.body.description).to.eql(newSymptom.description);
          expect(res.headers.location).to.eql(`/symptoms/${res.body.id}`);
        });
    });
    it("POST /symptoms responds with 400 if provided invalid valid", () => {
      const invalidData = {
        invalid: "data",
      };
      return supertest(app).post("/symptoms").send(invalidData).expect(500);
    });
  });

  describe("DELETE", () => {
    beforeEach("insert symptoms", () => {
      return db("symptoms").insert(symptoms);
    });
    it("DELETE /symptoms/:id should delete a specified symptom", () => {
      it("should delete an item", () => {
        return db("symptoms")
          .first()
          .then((check) => {
            return supertest(app).delete(`/symptoms/${check.id}`).expect(204);
          });
      });
    });

    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app).get("/").expect(200, "Hello, world!");
    });
  });

  describe("PATCH /symptoms/:id should update a symptom by id", () => {
    beforeEach("populate symptoms", () => {
      return db("symptoms").insert(symptoms);
    });
    it("should update by id", () => {
      const patchedSymp = {
        name: "symp",
        severity: 3,
        description: "updated symp",
      };
      let test;
      return db("symptoms")
        .first()
        .then((_test) => {
          test = _test;
          return supertest(app)
            .patch(`/symptoms/${test.id}`)
            .send(patchedSymp)
            .expect(204);
        });
    });
  });
});
