const session = require('express-session');
const db = require('./database');

const DEFAULT_TTL = 1000 * 60 * 60 * 24 * 2;
const CLEANUP_INTERVAL = 1000 * 60 * 15;

class SQLiteStore extends session.Store {
    constructor(options = {}) {
        super(options);

        this.ttl = options.ttl || DEFAULT_TTL;
        this.cleanupTimer = setInterval(() => this.clearExpired(), CLEANUP_INTERVAL);
        this.cleanupTimer.unref();
    }

    get(sid, callback) {
        try {
            const row = db.prepare('SELECT sess, expire FROM sessions WHERE sid = ?').get(sid);

            if (!row) {
                return callback(null, null);
            }

            if (row.expire <= Date.now()) {
                this.destroy(sid, () => {});
                return callback(null, null);
            }

            return callback(null, JSON.parse(row.sess));
        } catch (err) {
            return callback(err);
        }
    }

    set(sid, sess, callback) {
        try {
            const expire = this.getExpiry(sess);

            db.prepare(`
                INSERT INTO sessions (sid, sess, expire)
                VALUES (?, ?, ?)
                ON CONFLICT(sid) DO UPDATE SET
                    sess = excluded.sess,
                    expire = excluded.expire
            `).run(sid, JSON.stringify(sess), expire);

            if (callback) callback(null);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    destroy(sid, callback) {
        try {
            db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
            if (callback) callback(null);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    touch(sid, sess, callback) {
        try {
            db.prepare('UPDATE sessions SET expire = ? WHERE sid = ?').run(this.getExpiry(sess), sid);
            if (callback) callback(null);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    clearExpired() {
        try {
            db.prepare('DELETE FROM sessions WHERE expire <= ?').run(Date.now());
        } catch (err) {
            console.error('Failed to clear expired sessions', err);
        }
    }

    close() {
        clearInterval(this.cleanupTimer);
        this.clearExpired();
    }

    getExpiry(sess) {
        if (sess.cookie && sess.cookie.expires) {
            return new Date(sess.cookie.expires).getTime();
        }

        return Date.now() + this.ttl;
    }
}

module.exports = SQLiteStore;
