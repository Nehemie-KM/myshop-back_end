const express = require("express");
const mysql = require("mysql");
const app = express();
const expressPort = 3000;

app.use(express.json());

const dataBase = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "myShop",
});
dataBase.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("C'est good chef");
  }
});
app.listen(expressPort, () => {
  console.log("Le serveur tourne sur le serveur :", expressPort);
});


function isAdmin(req, res, next) {
  const { role } = req.headers; 
  if (role === "admin") {
    return next(); 
  } else {
    return res.status(403).json({ message: "Accès interdit. Vous devez être administrateur." });
  }
}

function isUserOrAdmin(req, res, next) {
  const { role } = req.headers;  

  if (role === "admin" || role === "user") {
    return next(); 
  } else {
    return res.status(403).json({ message: "Accès interdit." });
  }
}


app.get("/produits",isUserOrAdmin, (req, res) => {
  const sql = `
    SELECT produits.nom AS produits_id, categorie.nom AS categorie_id
    FROM produits 
    INNER JOIN produits_categorie ON produits.id = produits_categorie.produits_id
    INNER JOIN categorie ON produits_categorie.categorie_id = categorie.id`;
  dataBase.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else {
      return res.status(200).json(result);
    }
  });
});

app.post("/createProduits",verifyToken,isAdmin, (req, res) => {
  const { nom, prix, description, categorie_id } = req.body;
  const sql = `INSERT INTO produits (nom, prix, description) VALUES (?, ?, ?);`;
  dataBase.query(sql, [nom, prix, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    }
    const produits_id = result.insertId;
    const sqlget = `INSERT INTO produits_categorie (produits_id, categorie_id) VALUES (?, ?);`;
    dataBase.query(sqlget, [produits_id, categorie_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else {
        return res.status(200).json({
          message: "C'est ok chef!",
        });
      }
    });
  });
});

app.put("/putProduits/:id", verifyToken,isAdmin,(req, res) => {
  const { id } = req.params;
  const { nom, prix, description, categorie_id } = req.body;
  dataBase.query(
    `UPDATE produits SET nom = ?, prix = ?, description = ? WHERE id = ?`,
    [nom, prix, description, id],
    (err) => {
      if (err) return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      if (categorie_id) {
        dataBase.query(
          `UPDATE produits_categorie SET categorie_id = ? WHERE produits_id = ?`,
          [categorie_id, id],
          (err) => {
            if (err)
              return res.status(500).json({ error: "ERREUR DU SERVEUR" });
            res.json({ message: "C'est good chef" });
          }
        );
      }
    }
  );
});

app.delete("/deleteProduits/:id",verifyToken, isAdmin,(req, res) => {
  const { id } = req.params;
  const sqlDeleteAssoc = `
    DELETE FROM produits_categorie 
    WHERE produits_id = ?;
  `;
  dataBase.query(sqlDeleteAssoc, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    }
    const sqlDeleteProduct = `
      DELETE FROM produits 
      WHERE id = ?;`;
    dataBase.query(sqlDeleteProduct, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else {
        return res.status(200).json({ message: "C'est ok chef !" });
      }
    });
  });
});


app.get("/getUsers",verifyToken, isAdmin,(req, res) => {
  const sql = "SELECT * FROM utilisateurs;";
  dataBase.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else {
      return res.status(200).json(result);
    }
  });
});


app.put("/modifierUsers/:id",verifyToken,isAdmin, (req, res) => {
  const { nom, prenom, age, mail, mdp } = req.body;
  const { id } = req.params;
  const sql = `
    UPDATE utilisateurs 
    SET nom = ?, prenom = ?, mail = ?, mdp = ?
    WHERE id = ?;
  `;
  dataBase.query(
    sql,
    [nom, prenom,  mail, mdp, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else {
        return res.status(200).json({ message: "C'est good chef" });
      }
    }
  );
});


app.delete("/deleteUsers/:id",verifyToken,isAdmin, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM utilisateurs WHERE id = ?";
  dataBase.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else {
      return res.status(200).json({message: "C'est supprimé chef"});
    }
  });
});


app.post("/register", (req, res) => {
  const { nom, prenom, mail, mdp, role = 'user' } = req.body;  
  if (!nom || !prenom || !mail || !mdp) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs" });
  }
  dataBase.query(
    "SELECT * FROM utilisateurs WHERE mail = ?",
    [mail],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Erreur de base de données" });
      }
      if (results.length > 0) {
        return res.status(409).json({
          message: "Email déjà utilisé",
        });
      }
      dataBase.query(
        "INSERT INTO utilisateurs (nom, prenom, mail, mdp, role) VALUES (?, ?, ?, ?, ?)",
        [nom, prenom, mail, mdp, role],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Erreur de base de données" });
          }
          return res.status(201).json({ message: "Inscription réussie !" });
        }
      );
    }
  );
});

const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs" });
  }

  dataBase.query(
    "SELECT * FROM utilisateurs WHERE mail = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erreur de base de données : ", err);
        return res.status(500).json({ message: "Erreur de base de données" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const user = results[0]; 


      if (user.mdp !== password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      if (user.role === "admin") {
        const token = jwt.sign({ id: user.id, role: user.role }, "votre_clé_secrète", { expiresIn: "1h" });
        return res.status(200).json({
          message: `Bienvenue, ${user.nom} ${user.prenom}! Connexion réussie.`,
          token: token, 
        });
      }

      return res.status(200).json({
        message: `Bienvenue, ${user.nom} ${user.prenom}! Connexion réussie.`,
      });
    }
  );
});


function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token manquant. Accès interdit." });
  }


  const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(tokenWithoutBearer, "votre_clé_secrète", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide. Accès interdit." });
    }
    req.user = decoded; 
    next(); 
  });
}
