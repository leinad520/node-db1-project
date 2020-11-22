const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

const morgan = require('morgan');

server.use(express.json());
server.use(morgan('dev'));

// CRUD API

server.get('/', (req, res) => {
    db('accounts')
    .then(info => {
        console.log(info);
        res.status(200).json(info)
    })
    .catch(err => res.status(500).json(err))
})

server.post('/', (req, res) => {
    const {body} = req;

    if (body.name && body.budget) {
        db('accounts').insert(body)
        .then(id => {
            res.status(201).json(id)
        })
        .catch(err => {
            res.status(500).json(err)
            console.log(err);
        })
    } else {
        res.status(404).json({message: 'Request body must include name and budget'})
    }
})

server.put('/:id', (req, res) => {
    const {id} = req.params;
    const {body} = req;

    if (body.name || body.budget) {
        db('accounts')
        .where('id', id)
        .update(body)
        .then(num => {
            res.status(200).json(num)
        })
        .catch(err => {
            res.status(500).json(err)
            console.log(err);
        })
    } else {
        res.status(404).json({message: 'Request body must include name and budget'})
    }
})

server.delete('/:id', (req, res) => {
    const {id} = req.params;

    db('accounts').where('id', id).del()
    .then(count => {
        if (count) {
            res.json({deleted: count})
        } else {
            res.status(404).json({message: 'invalid id'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
        console.log(err)
    })
})

module.exports = server;
