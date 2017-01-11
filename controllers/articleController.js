import { Article } from '../models';
import { api, route } from '../utils';

module.exports = function (router) {
  router.route('/articles/~:key/:field?')
    .get(route.wrap(async (req, res) => {
      let {key} = req.params;
      let article = await Article.findOne({ key }, 'comments').populate('comments.author', 'name');

      res.send(article);
    }))
    .put(route.wrap(async (req, res) => {
      let {key, field} = req.params;
      let value = req.body;

      let article = await Article.findOne({ key }, field).populate(`${field}.author`, 'name');
      if (!article) {
        article = new Article({ key });
      }
      article[field].push(value);
      await article.save();

      res.send(value);
    }));
}