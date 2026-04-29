const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar no banco:", err);
    return;
  }

  console.log("Conectado ao MySQL");

  db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL
    )
  `);
});

app.get("/", (req, res) => {
  res.send("API DimDim rodando com Docker");
});

app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;

  db.query(
    "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
    [nome, email],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        mensagem: "Usuário criado com sucesso",
        id: result.insertId,
        nome,
        email
      });
    }
  );
});

app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  db.query(
    "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
    [nome, email, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        mensagem: "Usuário atualizado com sucesso"
      });
    }
  );
});

app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensagem: "Usuário deletado com sucesso"
    });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});