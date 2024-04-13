import express from "express";
import mysql from 'mysql';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"psms"
})

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.json("This is the response!")
});

app.get('/getTables', (req, res) => {
    // Query to get list of tables from the information_schema.tables table
    const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${db.config.database}';`;
    
    
    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Extract table names from the results
            const tables = results
            .map(row => row.TABLE_NAME).filter(tableName => tableName !== 'history');
            res.json(tables);
        }
    });
});

app.post('/dbget',(req,res)=>{
    const tableName=req.body.tableName
    const q = `select * from ${tableName}`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        else return res.json(data)
    })
})

app.post('/dbinsert',(req,res)=>{
    const tableName = req.body.tableName
    const q = `insert into ${tableName} values (?)`
    const values = [
        req.body.slotNo,
        req.body.Name,
        req.body.phoneNo,
        req.body.carNo,
        req.body.State
    ]
    db.query(q,[values],(err,data)=>{
        if (err) return res.json(err)
        else return res.json("Data successfully Inserted")
    })
})

app.post('/dbfree', (req,res)=>{
    const tableName = req.body.tableName
    const values = [
        req.body.slotNo,
        req.body.Name,
        req.body.phoneNo,
        req.body.carNo,
        req.body.State
    ]
    const q = `update ${tableName} set Name=${values[1]}, phoneNo=${values[2]}, carNo=${values[3]}, State=${values[4]} where slotNo='${values[0]}';`
    console.log(q)

    db.query(q,(err,data)=>{
        if (err) return res.json(err)
        else return res.json("Data successfully updated")
    })
})

app.post('/dbupdate', (req, res) => {
    const tableName = req.body.tableName;
    const values = [
        req.body.Name,
        req.body.phoneNo,
        req.body.carNo,
        req.body.State,
        req.body.slotNo
    ];
    console.log(values)
    const query = `UPDATE ${tableName} SET Name=?, phoneNo=?, carNo=?, State=? WHERE slotNo=?`;

    db.query(query, values, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error transferring data' });
        } else {
            console.log('Data transferred successfully');
            res.status(200).json({ message: 'Data transferred successfully' });
        }
    });
});

app.post('/dbmovhis', (req, res) => {
    const tableName = req.body.tableName;
    const slotNo = req.body.slotNo;
    const values = [
        req.body.slotNo,
        req.body.Name,
        req.body.carNo,
        req.body.phoneNo,
        req.body.State,
        req.body.EntryTime
    ];
    console.log(values)
    
    // Use placeholders (?) to avoid SQL injection and ensure proper formatting
    const q = `INSERT INTO history (slotNo, Name, carNo, phoneNo, State, created_at) VALUES (?, ?, ?, ?, ?, ?);`;

    console.log(q);

    // Pass values array as the second argument to db.query
    db.query(q, values, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error transferring data' });
        } else {
            console.log('Data transferred successfully');
            res.status(200).json({ message: 'Data transferred successfully' });
        }
    });
});


app.listen(8800, ()=>{
    console.log("Connected to backend!")
})
