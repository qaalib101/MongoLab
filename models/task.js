/**
 * Created by si8822fb on 3/20/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    text:String,
    completed: Boolean,
    dateCreated: Date,
    dateCompleted: Date
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
