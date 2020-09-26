const path = require('path');
const model = require('./model');
const salt = require(path.join(__dirname, 'config', 'db.json')).salt;
const hashing = require(path.join(__dirname, 'config', 'hashing.js'));
const moment = require('moment-timezone');
moment.tz.setDefault("America/Calgary");
const now_date = moment().format('YYYY-MM-DD HH:mm:ss');
const user_ip = require('ip');
const my_ip = require(path.join(__dirname, 'config', 'ip.js'));

module.exports = {
  needs: () => upload,
  api: {
      sendPw: (req, res) => {
        const body = req.body;
        const hash = hashing.enc(body.id, body.password, salt);

        model.api.searchInfo(body, hash, result => {
          let obj = {};
          
          if(result[0]) {
            obj['suc'] = result[0].dataValues;
            obj['msg'] = 'Login Sucessful';
            obj['ip'] = user_ip.address();
          } else {
            obj['suc'] = false;
            obj['msg'] = 'Login Failed';
          }
          res.send(obj); 
        });
      },

      getIp: (req, res) => {
        const ip = my_ip.ip();
        res.send(ip);
      }
  },
  
  add: {
    board: (req, res) => {
      // console.log(req.body);
      const body = req.body;

      model.add.board(body, result => {
        if(result) {
          res.send(true);
        }
      });
    },

    category: (req, res) => {
      const body = req.body;

      model.add.category(body, result => {
        let obj = {};
        if(result) {
          obj['suc'] = true;
          obj['msg'] = 'Category has been created.'; 
        } else {
          obj['suc'] = false;
          obj['msg'] = 'This category already exists.';
        }
        res.send(obj);
      });
    },

    user: (req, res) => {
      const body = req.body;
      const hash_pw = hashing.enc(body.id, body.password, salt);

      model.add.user(body, hash_pw, now_date, result => {
        
        res.send(result);
      })
    }
  },

  get: {
    board: (req, res) => {
      const body = req.body;
      console.log(body);
      model.get.board(body, result => {
        if(result) {
          res.send(result);
        }
      });
    },

    board_cnt: (req, res) => {
      const body = req.body;

      model.get.board_cnt(body, cnt => {
        const result = {cnt: cnt}
        res.send(result);
      });
    },

    board_data: (req, res) => {
      const body = req.body;

      model.get.board_data(body, data => {
        const result = {data: data}
        res.send(result);
      });
    },

    category: (req, res) => {

      model.get.category(data => {
        res.send(data);
      });
    }
  },

  update: {
    view_cnt: (req, res) => {
      const body = req.body;
            
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
      console.log(expires)
      const cookie_name = `board_${body.id}`;
      const exist_cookie = req.cookies[cookie_name];
      console.log(exist_cookie)

    
      if(!exist_cookie) {
        res.cookie(cookie_name, true, {
          expires: expires
        });

        model.update.view_cnt(body, result => {
          if(result) {
            res.send(true);
          }
        });
      }    
    }
  },

  delete: {
    category: (req, res) => {
      const body = req.body;

      model.delete.category(body, result => {
        if(result) {
          res.send(result);
        }
      });
    }
  },

  modify: {
    category: (req, res) => {
      const body = req.body;

      model.modify.category(body, result => {
        let obj = {};

        if(result) {
          obj['suc'] = true;
          obj['msg'] = 'The category name has been replaced.';
        } else {
          obj['suc'] = false;
          obj['msg'] = 'The category already exsists';
        }
        res.send(obj);
      });
    }
  }
} 