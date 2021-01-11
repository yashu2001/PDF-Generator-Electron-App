// Importing DB ORM
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
// Creating main instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./main.sqlite",
});
// Method to Authenticate the connection
const AuthenticateConnection = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      throw Error("Failed to connect");
    });
};

// Method to authenticate user

const AuthenticateUser = async (username, password) => {
  const user = await User.findAll({
    where: {
      username: username,
    },
    raw: true,
  });
  if (!user.length) {
    return { message: "Invalid username/password", error: true };
  } else {
    if (bcrypt.compareSync(password, user[0].password)) {
      return { error: false, message: user[0].role };
    } else {
      return { error: true, message: "Invalid username/password" };
    }
  }
};

// Models

// User Model

const User = sequelize.define("user", {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.STRING,
});

// Template Model
const Template = sequelize.define("template", {
  name: Sequelize.STRING,
  document_height: Sequelize.NUMBER,
  document_width: Sequelize.NUMBER,
  font_size: Sequelize.NUMBER,
  document_orientation: Sequelize.STRING,
  coordinates: Sequelize.JSON,
});

// DB Methods

const createUser = (params) => {
  return User.create({
    ...params,
    password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(10)),
  });
};

const updateUser = async (params) => {
  const user = await User.findAll({
    where: {
      username: params.username,
    },
  });
  if (!user.length) {
    return { error: true, message: "User not found" };
  }
  await user[0].update({
    password: bcrypt.hashSync(params.pass, bcrypt.genSaltSync(10)),
  });
  return { error: false, message: "Updated successfully" };
};

const syncSchemas = () => {
  return Promise.all([User.sync(), Template.sync()]);
};

const findUsers = (params) => {
  return User.findAll({
    where: {
      ...params,
    },
    raw: true,
  });
};

const createTemplate = async (params) => {
  const templates = await Template.findAll({
    where: {
      name: params.name,
    },
    raw: true,
  });
  if (!templates.length) {
    await Template.create({
      ...params,
    });
    return {
      error: false,
      message: `Template ${params.name} was successfully created`,
    };
  } else {
    return { error: true, message: "A template with this name already exists" };
  }
};

const fetchTemplatesList = async () => {
  const templates = await Template.findAll({ attributes: ["name"], raw: true });
  return templates;
};

const fetchTemplateByName = async (name) => {
  const template = await Template.findAll({
    where: {
      name: name,
    },
    raw: true,
  });
  return template;
};

module.exports = {
  Sequelize,
  sequelize,
  AuthenticateConnection,
  AuthenticateUser,
  createUser,
  syncSchemas,
  findUsers,
  createTemplate,
  fetchTemplatesList,
  fetchTemplateByName,
  updateUser,
};
