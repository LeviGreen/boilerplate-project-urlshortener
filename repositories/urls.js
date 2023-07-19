import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';

var Urls = function(){
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).dropCollection;
  const urlSchema = new mongoose.Schema({
    href: { type: String, required: true },
    _id: { type: Number, required: true }
  });
  let Url = mongoose.model('Url', urlSchema);

  this.createAndSaveUrl = async function(href, done) {
    var url = new Url({href: href, _id: Math.floor(Math.random() * 100000)});
    await url.save().then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    })
    return url;
  };

  this.findOneByUrl = function(href, done) {
    return Url.findOne({href: href}).then(function(result) {
      return result;
    }).catch(err => {
      console.log(err);
    });
  };

  this.findUrlById = function(urlId, done) {
    return Url.findById({_id: urlId}).then(function(result) {
      return result;
    }).catch(err => {
      console.log(err);
    });
  };
};

export default Urls;
