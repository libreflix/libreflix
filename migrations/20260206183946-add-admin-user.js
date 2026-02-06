var bcrypt = require('bcrypt-nodejs');

exports.up = function (mongoose, next) {
    // Ensure the model is registered
    require('../models/User');
    var User = mongoose.model('User');

    var adminData = {
        username: 'admin',
        email: 'admin@libreflix.org', // generic email
        password: 'admin123',
        adm: true,
        mod: true,
        name: 'Administrator'
    };

    // Check if user already exists
    User.findOne({ username: 'admin' }, function (err, user) {
        if (err) return next(err);
        if (user) {
            console.log('Admin user already exists.');
            return next();
        }

        // Hash password manually as we are using a migration and want to ensure it works even if model hooks change
        // Actually, if we use new User(adminData).save(), it will trigger the pre-save hook in models/User.js.

        var admin = new User(adminData);
        admin.save(function (err) {
            if (err) return next(err);
            console.log('Default admin user created.');
            next();
        });
    });
};

exports.down = function (mongoose, next) {
    require('../models/User');
    var User = mongoose.model('User');
    User.remove({ username: 'admin' }, next);
};
