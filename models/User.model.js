const bcrypt = require("bcrypt");
const db = require("../config/database");

const publicColumns = "id, username, email, created_at, isAdmin";

function toUser(row) {
    if (!row) {
        return null;
    }

    return {
        ...row,
        isAdmin: Boolean(row.isAdmin)
    };
}

exports.findByEmail = (email) => {
    return toUser(db.prepare("SELECT * FROM users WHERE email = ?").get(email));
};

exports.findById = (id) => {
    return toUser(db.prepare(`SELECT ${publicColumns} FROM users WHERE id = ?`).get(id));
};

exports.all = () => {
    return db.prepare(`SELECT ${publicColumns} FROM users ORDER BY id`).all().map(toUser);
};

exports.deleteById = (id) => {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id).changes > 0;
};

exports.create = ({ username, email, password }) => {
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    ).run(username, email, hash);

    return exports.findById(result.lastInsertRowid);
};

exports.validPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};
