const { MongoClient } = require('mongodb');
const fs = require('fs');
const { connectMongo } = require('./mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function injectToMongo() {
    let bddMongo;
    try {
        bddMongo = await connectMongo();

        const liveticketCollection = bddMongo.collection('liveticket');
        const truegisterCollection = bddMongo.collection('truegister');
        const disisfineCollection = bddMongo.collection('disisfine');

        const liveticketJson = JSON.parse(fs.readFileSync('./data_json/liveticket.json', 'utf-8'));
        const truegisterJson = JSON.parse(fs.readFileSync('./data_json/truegister.json', 'utf-8'));
        const disisfineJson = JSON.parse(fs.readFileSync('./data_json/disisfine.json', 'utf-8'));

        await liveticketCollection.insertMany(liveticketJson);
        await truegisterCollection.insertMany(truegisterJson);
        await disisfineCollection.insertMany(disisfineJson);
    console.log('Bravo !');
    } catch (error) {
        console.error('Dommage !', error)
    } finally {
        if (bddMongo) {
            await bddMongo.client.close();
        }
    }
}

injectToMongo().catch(console.dir);


