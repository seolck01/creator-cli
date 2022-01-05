const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const inquirer = require("inquirer");
const checkFileExist = function (dir) {
  isFile = false;
  try {
    if (fs.existsSync(path.join(process.cwd(), dir))) {
      isFile = true;
    }
  } catch (err) {}
  return isFile;
};
const configState = checkFileExist("create.config.js");
const projectDir = path.join(process.cwd());
let projectConfig = {};
if (configState) {
  projectConfig = require(path.join(process.cwd(), "create.config.js"));
}
module.exports = {
  mvc: async function (name) {
    await createController(name);
    await createService(name);
    await createModel(name);
  },
  web: async function (name) {
    await createWeb(name);
  },
};

const createController = async function (name) {
  let importConfig = {};
  if (
    projectConfig &&
    projectConfig.mvc &&
    projectConfig.mvc.controller &&
    typeof projectConfig.mvc.controller === "function"
  ) {
    importConfig = projectConfig.mvc.controller(name);
  }
  if (
    typeof importConfig !== "object" ||
    Array.isArray(importConfig) ||
    importConfig === null
  ) {
    importConfig = {};
  }
  const defaultConfig = require("./generator/controller")(name);
  const finalConfig = Object.assign(defaultConfig, importConfig);
  const { template, dir, name: fileName } = finalConfig;
  const isCreateDir = await checkDir(dir);
  if (isCreateDir) {
    const coverFile = await checkFile(path.join(dir, fileName));
    if (coverFile) {
      fs.writeFileSync(path.join(projectDir, dir, fileName), template.trim());
      console.log(`> ${path.join(dir, fileName)}  文件创建成功`);
    }
  }
};
const createService = async function (name) {
  let importConfig = {};
  if (
    projectConfig &&
    projectConfig.mvc &&
    projectConfig.mvc.service &&
    typeof projectConfig.mvc.service === "function"
  ) {
    importConfig = projectConfig.mvc.service(name);
  }
  if (
    typeof importConfig !== "object" ||
    Array.isArray(importConfig) ||
    importConfig === null
  ) {
    importConfig = {};
  }
  const defaultConfig = require("./generator/service")(name);
  const finalConfig = Object.assign(defaultConfig, importConfig);
  const { template, dir, name: fileName } = finalConfig;
  const isCreateDir = await checkDir(dir);
  if (isCreateDir) {
    const coverFile = await checkFile(path.join(dir, fileName));
    if (coverFile) {
      fs.writeFileSync(path.join(projectDir, dir, fileName), template.trim());
      console.log(`> ${path.join(dir, fileName)}  文件创建成功`);
    }
  }
};
const createModel = async function (name) {
  let importConfig = {};
  if (
    projectConfig &&
    projectConfig.mvc &&
    projectConfig.mvc.model &&
    typeof projectConfig.mvc.model === "function"
  ) {
    importConfig = projectConfig.mvc.model(name);
  }
  if (
    typeof importConfig !== "object" ||
    Array.isArray(importConfig) ||
    importConfig === null
  ) {
    importConfig = {};
  }
  const defaultConfig = require("./generator/model")(name);
  const finalConfig = Object.assign(defaultConfig, importConfig);
  const { template, dir, name: fileName } = finalConfig;
  const isCreateDir = await checkDir(dir);
  if (isCreateDir) {
    const coverFile = await checkFile(path.join(dir, fileName));
    if (coverFile) {
      fs.writeFileSync(path.join(projectDir, dir, fileName), template.trim());
      console.log(`> ${path.join(dir, fileName)}  文件创建成功`);
    }
  }
};

const createWeb = async function (name) {
  let importConfig = {};
  if (
    projectConfig &&
    projectConfig.web &&
    typeof projectConfig.web === "function"
  ) {
    importConfig = projectConfig.web(name);
  }
  if (
    typeof importConfig !== "object" ||
    Array.isArray(importConfig) ||
    importConfig === null
  ) {
    importConfig = {};
  }
  const defaultConfig = require("./generator/web")(name);
  const finalConfig = Object.assign(defaultConfig, importConfig);
  const { template, dir, name: fileName } = finalConfig;
  const isCreateDir = await checkDir(dir);
  if (isCreateDir) {
    const coverFile = await checkFile(path.join(dir, fileName));
    if (coverFile) {
      fs.writeFileSync(path.join(projectDir, dir, fileName), template.trim());
      console.log(`> ${path.join(dir, fileName)}  文件创建成功`);
    }
  }
};

// 是否创建文件夹
const checkDir = async function (dir) {
  const createPath = path.join(projectDir, dir);
  const hasFolder = fs.existsSync(createPath);
  const confirm = async function () {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "creteDir",
            message: `${dir}不存在，是否创建`,
            default: true,
          },
        ])
        .then((answers) => {
          if (answers && answers.creteDir) {
            mkdirp.sync(createPath);
            resolve(answers.creteDir);
          }
          resolve(false);
        })
        .catch((error) => {
          resolve(false);
        });
    });
  };
  if (!hasFolder) {
    const createResult = await confirm();
    if (createResult) {
      return true; // 创建文件夹
    } else {
      return false; // 不创建
    }
  }
  return true;
};

// 是否覆盖文件
const checkFile = async function (dir) {
  const createFilePath = path.join(projectDir, dir);
  const hasFile = fs.existsSync(createFilePath);
  const confirm = async function () {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "coverFile",
            message: `${dir}文件已存在，是否覆盖`,
            default: true,
          },
        ])
        .then((answers) => {
          if (answers && answers.coverFile) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });
  };
  if (hasFile) {
    const createResult = await confirm();
    if (createResult) {
      return true; // 覆盖
    } else {
      return false; // 不覆盖
    }
  }
  return true; // 不存在直接创建
};
