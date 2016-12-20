var commandExecutor = require('child_process').exec;
var command = 'bash deploy.sh';
var watch = require('node-watch');

watch('index.js', function (filename) {
    console.log(filename, ' changed.');
    commandExecutor(command, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        console.log(stdout);
    });
});
