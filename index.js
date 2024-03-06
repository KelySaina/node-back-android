const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

require('dotenv').config()

app.use(express.json());
app.use(cors());

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
});

app.get('/', (req, res) => {
    res.send("404 Not Found")
})

app.get('/listEtudiants', (req, res) => {
    conn.query('SELECT * FROM Etudiant', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.send(`Error listing Etudiant: ${err.sqlMessage}`);
        }
        res.send(results)
    });
});

app.post('/delEtudiant/:id', (req, res) => {
    const numE = req.params.id;

    conn.query('DELETE FROM Etudiant WHERE numEt = ?', [numE], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send(`Error deleting Etudiant: ${err.sqlMessage}`);
        }

        res.send("Etudiant's records deleted successfully");
    });
});

app.post('/inEtudiant', (req, res) => {
    const { numE, nom, noteM, noteP } = req.body;

    conn.query('INSERT INTO Etudiant (numEt, nom, noteMath, notePhy) VALUES (?,?,?,?)', [numE, nom, noteM, noteP], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.send(`Error inserting Etudiant: ${err.sqlMessage}`);
        }

        res.send("Etudiant's records inserted successfully");
    });
});

app.post('/modEtudiant', (req, res) => {
    const { numE, newNom, newNoteM, newNoteP } = req.body;

    conn.query('UPDATE Etudiant SET nom = ?, noteMath = ?, notePhy = ? WHERE numEt = ?', [newNom, newNoteM, newNoteP, numE], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.send(`Error editing Etudiant: ${err.sqlMessage}`);
        }

        res.send("Etudiant's records modified successfully");
    });

});

app.get('/getEtudiant/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT * FROM Etudiant where id_Etudiant = ?', [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.send(`Error getting Etudiant: ${err.sqlMessage}`);
        }
        res.send(results)
    });
});

app.get('/*', (req, res) => {
    res.send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});

