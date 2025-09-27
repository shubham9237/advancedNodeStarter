const mongoose = require("mongoose");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
    console.log("Iam about run a queru");
    return exec.apply(this, arguments);
}