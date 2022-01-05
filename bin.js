#!/usr/bin/env node
const program = require("commander");
const version = require("./package.json").version;
const { mvc, web } = require("./create");
program.version(version, "-v, --version");
program
  .command("mvc <file-name>")
  .description("创建mvc模板")
  .option("-d --dir <dir>", "创建目录")
  .action((name, command) => {
    mvc(name);
  });

program
  .command("web <file-name>")
  .description("创建web模板")
  .option("-d --dir <dir>", "创建目录")
  .action((name, command) => {
    web(name);
  });
program.parse(process.argv);
