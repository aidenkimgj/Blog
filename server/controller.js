const path = require('path');
const model = require('./model');
const salt = require(path.join(__dirname, 'config', 'db.json')).salt;

const hashing = require(path.join(__dirname, 'config', 'hashing.js'));

module.exports = {
  needs: () => upload,
  api: {
      sendPw: (req, res) => {
        const body = req.body;
        const hash = hashing.enc(body.id, body.password, salt)

        model.api.searchInfo(body, hash, result => {
          let obj = {};
          if(result[0]) {
            obj['suc'] = true;
            obj['msg'] = 'Login Sucessful';
          } else {
            obj['suc'] = false;
            obj['msg'] = 'Login Failed';
          }
          res.send(obj); 
        });
      },
  },
  
  add: {
    board: (req, res) => {
      console.log(req.body);
      const body = req.body;

      model.add.board(body, result => {
        if(result) {
          res.send(true);
        }
      });
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
  }
} 