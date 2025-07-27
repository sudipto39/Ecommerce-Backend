const mongoose = require("mongoose");
require("dotenv").config();

// const bcrypt = require("bcryptjs");
const User = require("./User");

const createAdminUser = async () => {

  try {

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // const hashedPassword = await bcrypt.hash(adminPassword, 12);

      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      

      await adminUser.save();
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('ℹ️ Admin user already exists:');
    }

    // mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

module.exports = {createAdminUser};

