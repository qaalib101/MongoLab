/**
 * Created by si8822fb on 3/20/2018.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var taskSchema = new mongoose.Schema ({

    text: String,
    completed : Boolean,
    dateCreated: Date,
    dateCompleted: Date,
    dateDeleted: Date,

    _creator : { type : ObjectId, ref : 'User' }

});


var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
