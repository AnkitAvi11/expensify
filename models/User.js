const db = require('../utils/database');

class User {

    constructor(body) {
        this.fname = body.fname;
        this.email = body.email;
        this.pwd = body.pwd;
    }

    static findByEmail(email) {
        return db.execute("SELECT email from user_login WHERE email = ? LIMIT 1", [email]);
    }

    save() {
        return db.execute("INSERT INTO user_login (fname, email, pwd) VALUES (? ,? ,?) ", [this.fname, this.email, this.pwd]);
    };

    static getUser(email) {
        return db.execute("SELECT user_id, fname ,email, pwd from user_login WHERE email = ? LIMIT 1", [email]);
    }
    
}

module.exports = User;
