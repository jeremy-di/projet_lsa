const { MongoClient } = require('mongodb');
const fs = require('fs');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const connexion = require ('./db');
const mysql = require('mysql2');
const { connectMongo } = require('./mongodb');
const { connectToSQL } = require('./mysql');

// ! Normalisation

async function normalizeMongoData(bddMongo) {
    try {
        const newData = [];

        const liveticketCollection = bddMongo.collection('liveticket');
        const truegisterCollection = bddMongo.collection('truegister');
        const disisfineCollection = bddMongo.collection('disisfine');

        const liveticket = await liveticketCollection.find({}).toArray();
        liveticket.forEach(evenement => {
            newData.push({
                e_name : evenement.event,
                // e_dateCreation : null,
                e_debut : evenement.start,
                e_end : evenement.end,
                e_maxPersonnes : evenement.max,
                e_lieu : evenement.where,
                e_attendees : evenement.attendees.map(attendee => ({
                    a_prenom : attendee.fn,
                    a_nom : attendee.ln,
                    a_inscription : attendee.when
                }))
            });
        });

        const truegister = await truegisterCollection.find({}).toArray();
        truegister.forEach(result =>{
            result.results.forEach(evenement => {
                newData.push({
                    e_name : evenement.event.event_name,
                    // e_dateCreation : null,
                    e_debut : evenement.event.event_begin,
                    e_end : evenement.event.event_finish,
                    e_maxPersonnes : null,
                    e_lieu : evenement.event.event_where,
                    attendees : evenement.attendees.map(attendee => ({
                        a_prenom : attendee.attendee_1,
                        a_nom : attendee.attendee_2,
                        a_inscription : null
                    }))
                })
            })
        });

        const disisfine = await disisfineCollection.find({}).toArray();
        disisfine.forEach(evenement => {
            const attendees = JSON.parse(evenement.attendees);
            newData.push({
                e_name : evenement.e_name,
                e_debut : evenement.e_start,
                e_end : evenement.e_finish,
                e_maxPersonnes : evenement.e_attendees_max,
                e_lieu : evenement.e_location,
                e_attendees : attendees.map(attendee => ({
                    a_prenom : attendee[0],
                    a_nom : attendee[1],
                    a_inscription : attendee[2]
                }))
            })
        })
        return newData     
    } catch (error) {
        console.error('Dommage !', error)
    }
}

// ! Procédures

async function injectToMySQL(connexion, data) {
    for ( evenement of data ) {
        try {
            await connexion.execute(
                'CALL creation_evenement(?, ?, ?, ?, ?, ?)',
                [
                    evenement.e_name,
                    new Date(),
                    evenement.e_debut,
                    evenement.e_end,
                    evenement.e_maxPersonnes,
                    evenement.e_lieu
                ]
            )
            console.log("Evènements ajoutés")
        } catch (error) {
            console.error('Erreur', error)
        }
    }
}



async function main() {
    const bddMongo = await connectMongo();
    const connexion = await connectToSQL();
    const parserData = await normalizeMongoData(bddMongo)
    try {
        await injectToMySQL(connexion, parserData)
        console.log('Succès')
    } catch (error) {
        console.log("Erreur d'injection", error)
    }
}

main();




// const parserFichiers = () => {

    
//     const liveticket = JSON.parse(fs.readFileSync('./data_json/liveticket.json', 'utf-8'));
//     liveticket.forEach(evenement => {
//         newData.push({
//             e_name : evenement.event,
//             // e_dateCreation : null,
//             e_debut : evenement.start,
//             e_end : evenement.end,
//             e_maxPersonnes : evenement.max,
//             e_lieu : evenement.where,
//             e_attendees : evenement.attendees.map(attendee => ({
//                 a_prenom : attendee.fn,
//                 a_nom : attendee.ln,
//                 a_inscription : attendee.when
//             }))
            
//         });
//     });

//     const truegister = JSON.parse(fs.readFileSync('./data_json/truegister.json', 'utf-8'));
//     truegister.forEach(result =>{
//         result.results.forEach(evenement => {
//             newData.push({
//                 e_name : evenement.event.event_name,
//                 // e_dateCreation : null,
//                 e_debut : evenement.event.event_begin,
//                 e_end : evenement.event.event_finish,
//                 e_maxPersonnes : null,
//                 e_lieu : evenement.event.event_where,
//                 attendees : evenement.attendees.map(attendee => ({
//                     a_prenom : attendee.attendee_1,
//                     a_nom : attendee.attendee_2,
//                     a_inscription : null
//                 }))
//             })
//         })
//     });

//     const disisfine = JSON.parse(fs.readFileSync('./data_json/disisfine.json', 'utf-8'));
//     disisfine.forEach(evenement => {
//         const attendees = JSON.parse(evenement.attendees);
//         newData.push({
//             e_name : evenement.e_name,
//             e_debut : evenement.e_start,
//             e_end : evenement.e_finish,
//             e_maxPersonnes : evenement.e_attendees_max,
//             e_lieu : evenement.e_location,
//             e_attendees : attendees.map(attendee => ({
//                 a_prenom : attendee[0],
//                 a_nom : attendee[1],
//                 a_inscription : attendee[2]
//             }))
//         })
//     })

//     return newData;
// }

// //! 2
// // Générer un nouveau fichier json

// const genererFichierStandard = () => {
//     const file = parserFichiers();

//     fs.writeFileSync('./data_json/fichier_normalise.json', JSON.stringify(file, null, 2));
//     console.log('Fichier généré');
// }

// //! 3
// // Execution du script

// genererFichierStandard();