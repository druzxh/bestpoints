const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Place = require('./models/place')
const methodOverride = require('method-override');

const app = express()
mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => {
        console.log('connected to mongodb')
    }).catch((err) => {
        console.log(err)
    });

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

// GET
app.get('/places', async (req, res) => {
    const places = await Place.find()
    res.render('places/index', { places })
})

// CREATE
app.get('/places/create', async (req, res) => {
    res.render('places/create')
})

app.post('/places', async (req, res) => {
    const place = new Place(req.body.place)
    await place.save()
    res.redirect('places')
})

// SHOW
app.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/show', { place })
})

// DELETE
app.delete('/places/:id', async (req, res) => {
    await Place.findByIdAndDelete(req.params.id)
    res.redirect('/places')
})

// UPDATE
app.get('/places/:id/update', async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/update', { place })
})

app.put('/places/:id/update', async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, req.body.place)
    res.redirect('/places')
})

app.get('/seed/place', async (req, res) => {
    const place = new Place({
        title: 'Taman Mini Indonesia Indah',
        price: 20000,
        description: 'Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia',
        location: 'Taman Mini Indonesia Indah, Jakarta',
        image: 'https://source.unsplash.com/collection/2349781/1280x720',
        geometry: {
            type: "Point",
        }
    })

    await place.save()
    res.send(place)
})

app.listen(3000, () => {
    console.log(`server is running on http://127.0.0.1:3000`);
});