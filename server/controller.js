const path = require('path');
const model = require('./model');
const salt = require(path.join(__dirname, 'config', 'db.json')).salt;
const hashing = require(path.join(__dirname, 'config', 'hashing.js'));
const moment = require('moment-timezone');
moment.tz.setDefault("America/Calgary");
const now_date = moment().format('YYYY-MM-DD HH:mm:ss');
const user_ip = require('ip');
const personal_info = require(path.join(__dirname, 'config', 'personal.js'));
const nodeMailer = require('nodemailer');

const mailPoster = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gksxogns2000@gmail.com',
    pass: personal_info.email_pass(),
  }
});

const mailOpt = (user_data, title, contents) => {
  const mailOption = {
    from: 'gksxogns2000@gmail.com',
    to: user_data.email,
    subject: title,
    text: contents,
  };
  
  return mailOption;
}

const send_Mail = mailOption => {
  mailPoster.sendMail(mailOption, (error, info) => {
    if(error) {
      console.log('Error', error);
    } else {
      console.log('Send has been completed', info.response);
    }
  });
}
console.log("컨트롤러 불림");
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
        const ip = personal_info.ip();
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
    },

    pre_and_next: (req, res) => {
      const body = req.body;

      model.get.pre_and_next(body, data => {
        res.send(data);
      });
    }
  },

  update: {
    view_cnt: (req, res) => {
      const body = req.body;
            
      const expires = new Date();
      
      expires.setDate(expires.getDate() + 1);
      
      const cookie_name = `board_${body.id}_user_${body.user_id}`;
      const exist_cookie = req.cookies[cookie_name];
      

    
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
    },

    password: (req, res) => {
      const body = req.body;
      const hash_pw = hashing.enc(body.user_id, body.change_password, salt);

      model.update.password(body, hash_pw, result => {
        res.send(result);
      })
    },

    like: (req, res) => {
      const body = req.body;

      model.check.like(body, data => {
        if(data.length === 0) {
          model.update.like(body, result => {
            res.send(result);
          });
        } else {
          if(body.type === 'remove') {
            model.update.like(body, result => {
              res.send(result);
            });
          } else {
            res.send(false);
          }
        }
      });
    },
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
  },

  search: {
    id: (req, res) => {
      const body = req.body;
      console.log('search', body)
      model.search.id(body, result => {
        res.send(result);
      });
    },

    pw: (req, res) => {
      const body = req.body;

      model.search.pw(body, result => {
        let res_data = {};

        if(result[0]) {
          const title = 'This is OTP for Aiden\'s Blog';
          const contents = () => {
            let number = "";
            let random = 0;

            for(let i = 0; i < 6; i++) {
              random = Math.floor(Math.random()*10);
              number += random;
            }
            res_data['secret'] = number;
            return `Please type follow number ${number} into authentication box`
          }

          const mailOption = mailOpt(result[0].dataValues, title, contents());

          send_Mail(mailOption);

          res_data['result'] = result;
          res.send(res_data);
        
        } else {
          res.send(false);
        }
        
      });
    }, 
  },

  check: {
    like: (req, res) => {
      const body = req.body;

      model.check.like(body, result => {
        res.send(result);
      })
    }
  }
} 