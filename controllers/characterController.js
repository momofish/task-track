var mongoose = require("mongoose");
var Character = require("../models/character");
var _ = require('underscore');

module.exports = function(router) {
  router.route('/').get(function(req, res, next) {
    var choices = ['Female', 'Male'];
    var randomGender = _.sample(choices);

    Character.find({ random: { $near: [Math.random(), 0] } })
      .where('voted', false)
      .where('gender', randomGender)
      .limit(2)
      .exec(function(err, characters) {
        if (err) return next(err);

        if (characters.length === 2) {
          return res.send(characters);
        }

        var oppositeGender = _.first(_.without(choices, randomGender));

        Character
          .find({ random: { $near: [Math.random(), 0] } })
          .where('voted', false)
          .where('gender', oppositeGender)
          .limit(2)
          .exec(function(err, characters) {
            if (err) return next(err);

            if (characters.length === 2) {
              return res.send(characters);
            }

            Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
              if (err) return next(err);
              res.send([]);
            });
          });
      });
  });

  router.route("/count").get(function(req, res, next) {
    Character.count({}, function(err, count) {
      if (err) return next(err);

      res.send({ count: count });
    });
  });

  router.route('/search').get(function(req, res, next) {
    var characterName = new RegExp(req.query.name, 'i');

    Character.findOne({ name: characterName }, function(err, character) {
      if (err) return next(err);

      if (!character) {
        return res.status(404).send({ message: 'Character not found.' });
      }

      res.send(character);
    });
  });

  router.route('/:id').get(function(req, res, next) {
    var id = req.params.id;

    Character.findOne({ characterId: id }, function(err, character) {
      if (err) return next(err);

      if (!character) {
        return res.status(404).send({ message: 'Character not found.' });
      }

      res.send(character);
    });
  });
}