const sequelize = require('./models').sequelize;
const moment = require('moment-timezone');
moment.tz.setDefault("America/Calgary");
const now_date = moment().format('YYYY-MM-DD HH:mm:ss');
// console.log(now_date)

const {
  Board,
  Category,
  User,
  Like,
  Sequelize:{Op}
} = require('./models');
sequelize.query('SET NAMES utf8;');

module.exports = {
  
  api: {
    searchInfo: (body, hash, callback) => {
      User.findAll({
        where: {[Op.and]: [{id: body.id, password: hash}]}
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
        cat_id: body.category,
        likes: 0,
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
    },

    user: (body, hash_pw, now_date, callback) => {
      User.count({
        where: {id: body.id}
      })
      .then(cnt => {
        if(cnt > 0) {
          callback(false);
        } else {
          User.create({
            admin: 'N',
            id: body.id,
            password: hash_pw,
            email: body.email,
            signup_date: now_date
          })
          .then(() => callback(true))
          .catch(err => {
            throw err;
          });
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
          
          limit: body.limit, 
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
          
          limit: body.limit, 
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
      if(body.category === '') {
        Board.count({ 
          where: {
            title: {
              [Op.like]: search
            },
            contents: {
              [Op.like]: search
            },
            
          }
        })
        .then(result => {
          callback(result);
        });
      } else {
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
      }
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

    category: (callback) => {
      Category.findAll()
      .then(result => {
        callback(result);
      })
      .catch(err => {
        throw err;
      })
    },

    pre_and_next: (body, callback) => {
      let result = {};

      let where_1 = body.category;
      let where_2 = '';

      if(!body.category) {
        where_2 = 0;
      } else if(body.category) {
        where_2 = null;
      }
      Board.findAll({
        where: {
          board_id: {
            [Op.gt]: body.board_id
          },
          cat_id: {
            [Op.or]: {
              [Op.eq]: where_1,
              [Op.gt]: where_2
            }
          }
        },
        limit: 1
      })
      .then(next => {
        result['next'] = next;

        Board.findAll({
          where: {
            board_id: {
              [Op.lt]: body.board_id
            },
            cat_id: {
              [Op.or]: {
                [Op.eq]: where_1,
                [Op.gt]: where_2
              }
            }
          },
          limit: 1,
          order: sequelize.literal('board_id DESC')
      })
      .then(pre => {
        result['pre'] = pre;
        callback(result);
      })
      .catch(err => {
        throw err;
      });
    })
    .catch(err => {
      throw err;
    })

    }
  },

  update: {
    view_cnt: (body, callback) => {
      
      Board.update({view_cnt : sequelize.literal('view_cnt + 1')}, {
        where: {board_id: body.id}
      })
      .then(data => {
        callback(true);
      })
      .catch(err => {
        throw err;
      });
    },

    password: (body, hash_pw, callback) => {

      User.update({password: hash_pw}, {
        where: {id: body.user_id}
      })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        throw err;
      });
    },

    like: (body, callback) => {

      if(body.type === 'add') {
        Board.update({likes: sequelize.literal('likes + 1')}, {
          where: {board_id: body.board_id}
        })
        .then(() => {
          Like.create({
            board_id: body.board_id,
            user_id: body.user_id
          })
          .then(() => {
            callback(true);
          })
          .catch(err => {
            throw err;
          })
        })
        .catch(err => {
          throw err;
        });
      } else {
        Board.update({likes: sequelize.literal('likes - 1')}, {
          where: {board_id: body.board_id}
        })
        .then(() => {
          Like.destroy({
            where: {
              board_id: body.board_id,
              user_id: body.user_id
            }
          })
          .then(() => {
            callback(true);
          })
          .catch(err => {
            throw err;
          })
        })
        .catch(err => {
          throw err;
        })
      }
      
    },
  },

  delete: {
    category:(body, callback) => {
      Category.destroy({
        where: {id: body.id}
      })
      .then(() => {
        Board.update({cat_id: 0}, {
          where: {cat_id: body.id}
        })
        .then(() => {callback(true)})
        .catch(err => {throw err;});
      })
    }
  },

  modify: {
    category: (body, callback) => {
      Category.count({
        where: {name: body.name}
      })
      .then(cnt => {
        if(cnt > 0) {
          callback(false);
        } else {
          Category.update({name: body.name}, {
            where: {id: body.id}
          })
          .then(() => {
            callback(true);
          })
          .catch(err => {
            throw err;
          });
        }
      }) 
    }
  },

  search: {
    id: (body, callback) => {
      User.findAll({
        where: {email: body.email}
      })
      .then(result => {callback(result);})
      .catch(err => {
        throw err;
      });
    },

    pw: (body, callback) => {
      User.findAll({
        where: {
          id: body.id,
          email: body.email
        }
      })
      .then(result => {callback(result);})
      .catch(err => {
        throw err;
      });
    },
  },

  check: {
    like: (body, callback) => {
      Like.findAll({
        where: {
          board_id: body.board_id,
          user_id: body.user_id
        }
      })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        throw err;
      });
    }
  }
}