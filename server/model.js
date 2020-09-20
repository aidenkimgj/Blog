const sequelize = require('./models').sequelize;
let moment = require('moment-timezone');

const now_date = moment().tz("America/Calgary").format('YYYY-MM-DD HH:mm:ss');


const {
  Admin,
  Board,
  Category,
  Sequelize:{Op}
} = require('./models');
sequelize.query('SET NAMES utf8;');

module.exports = {
  
  api: {
    searchInfo: (body, hash, callback) => {
      Admin.findAll({
        where: {[Op.and]: [{user_id: body.id, password: hash}]}
      })
      .then(data => {
        callback(data);
      })
      .catch(err => {
        throw err;
      });
    }
  },
  
  add: {
    board: (body, callback) => {
      Board.create({
        title: body.title,
        contents: body.contents,
        date: now_date,
        view_cnt: 0,
        cat_id: 0,
      })
      .then(data => {
        callback(true);
      })
      .catch(err => {
        throw err;
      });
    },
    
    category: (body, callback) => {
      Category.count({
        where: {name: body.name}
      })
      .then(cnt => {
        if(cnt > 0) {
          callback(false);
        } else {
          Category.create({
            name: body.name
          })
          .then(() => callback(true))
          .catch(err => {
            throw(err);
          })
        }
      })
      .catch(err => {
        throw err;
      });
    }
  },
  
  get: {
    board: (body, callback) => {

      let search = "%%";

      if(body.search) {
        search = `%${body.search}%`;
      }
      
      if(body.category === '') {
        Board.findAll({
          where: {
            [Op.or]: [{
              title : {
                [Op.like]: search}},{ 
              contents: {
                [Op.like]: search}}], 
          },
          
          limit: (body.page*body.limit), 
          offset: (body.page-1)*body.limit, 
          order: sequelize.literal('board_id DESC') 
        })
        .then(data => {
          
          callback(data);
        })
        .catch(err => {
          throw err;
        });
      } else {
        Board.findAll({
          where: {
            [Op.or]: [{
              title : {
                [Op.like]: search}},{ 
              contents: {
                [Op.like]: search}}], 
              
              cat_id: body.category
            },
          
          limit: (body.page*body.limit), 
          offset: (body.page-1)*body.limit, 
          order: sequelize.literal('board_id DESC') 
        })
        .then(data => {
          
          callback(data);
        })
        .catch(err => {
          throw err;
        });
      }
    },

    board_cnt: (body, callback) => {
      let search = "%%";

      if(body.search) {
        search = `%${body.search}%`;
      }

      Board.count({ 
        where: {
          title: {
            [Op.like]: search
          },
          contents: {
            [Op.like]: search
          },
          cat_id: body.category
        }
      })
      .then(result => {
        callback(result);
      });
    },

    board_data: (body, callback) => {

      Board.findAll({
        where: {board_id: body.id}
      })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        throw err;
      });
    },

    category : (callback) => {
      Category.findAll()
      .then(result => {
        callback(result);
      })
      .catch(err => {
        throw err;
      })
    }
  },

  update: {
    view_cnt : (body, callback) => {
      
      Board.update({view_cnt : sequelize.literal('view_cnt + 1')}, {
        where: {board_id: body.id}
      })
      .then(data => {
        callback(true);
      })
      .catch(err => {
        throw err;
      });
    }
  }
}