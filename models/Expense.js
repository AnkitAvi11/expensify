const db = require('../utils/database');

module.exports = class Expense {

    constructor (body) {
        this.user_id = body.user_id;
        this.title = body.title;
        this.description  = body.desc;
        this.amount = body.amount;
        this.type = body.type;
        this.exp_date = body.date;
    }

    save() {
        const sql = "INSERT INTO expenses (user_id, title, description, amount, type, exp_date) VALUES (?, ? , ? , ? ,? , ?) ";
        return db.execute(sql, [this.user_id, this.title, this.description, this.amount, this.type, this.exp_date]);
    }

    static update(new_expense_data) {
        
    }

    static getPresentDayExpense(user_id) {
        let date = new Date().toLocaleDateString();
        let sql = "SELECT e_id, title, description, amount, type, exp_date FROM expenses WHERE user_id = ? AND exp_date = ? ORDER BY e_id DESC LIMIT 3";
        return db.execute(sql,[user_id, date]);
    }

    static totalExpense(user_id) {
        let sql = "SELECT SUM(amount) total FROM expenses WHERE user_id = ? AND type='debit'";
        return db.execute(sql, [user_id]);
    }

    static getById(user_id, exp_id) {
        let sql = "SELECT * from expenses WHERE user_id = ? AND e_id = ?";
        return db.execute(sql, [user_id, exp_id]);
    }

}