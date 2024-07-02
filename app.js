const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const porta = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

app.get("/busca_cep", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      
      const cep = req.params.cep;
      const allDocs= db.collection("busca_cep").get();
  
      res.status(200).json(allDocs);
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  });

app.get("/busca_cep/:cep", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    const cep = req.params.cep;
    const docRef = db.collection("busca_cep").doc(cep);

    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).send("Cep não encontrado!");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.post("/busca_cep", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var info = {
      logradouro: req.body.logradouro,
      complemento: req.body.complemento,
      bairro: req.body.bairro,
      localidade: req.body.localidade,
      uf: req.body.uf,
    };
    await db.collection("busca_cep").doc(req.body.cep).set(info);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(porta || 3000, () => {
  console.log("servidor rodando");
});
