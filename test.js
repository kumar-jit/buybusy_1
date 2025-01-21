

function exportModule(){
    console.log("export modeule");
}

function exportModule2(){
    console.log("export modeule");
}
function exportModule3(){
    console.log("export modeule");
}

// single function export
module.exports = exportModule;


// multiple function export
module.exports = {
    exportModule,
    exportModule2,
    exportModule3
} // or
module.exports.exportModule = exportModule;
module.exports.exportModule2 = exportModule2;
module.exports.exportModule3 = exportModule3;





// to import this module in another file 
const test = require('./test.js');



(function(exports, require, module, __filename, __dirname) {
    // Your module code here
});