[].forEach.call(document.querySelectorAll('pre'), function($pre) {
    var lines = $pre.textContent.split('\n');
    var matches;
    var indentation = (matches = /^\s+/.exec(lines[0])) != null ? matches[0] : null;
    if (!!indentation) {
        lines = lines.map(function(line) {
            return line.replace(indentation, '');
    });
    return $pre.textContent  = lines.join('\n').trim();
    }
});

const py_btns  = document.querySelectorAll(".python_btn");
const cpp_btns = document.querySelectorAll(".cpp_btn");
const js_btns = document.querySelectorAll(".js_btn");

const py_text  = document.querySelectorAll(".python_text");
const cpp_text = document.querySelectorAll(".cpp_text");
const js_text = document.querySelectorAll(".js_text");


function change_exampel_layers(pyZ, cppZ, jsZ) {
    for(let j = 0; j < py_text.length; j++){
        py_text[j].style.zIndex = pyZ;
        cpp_text[j].style.zIndex = cppZ;
        js_text[j].style.zIndex = jsZ;
    }
}

for(let i = 0; i < py_btns.length; i++){
    py_btns[i].addEventListener("click", () => change_exampel_layers("10", "5", "5"))
}


for(let i = 0; i < py_btns.length; i++){
    cpp_btns[i].addEventListener("click", () => change_exampel_layers("5", "10", "5"))
}


for(let i = 0; i < py_btns.length; i++){
    js_btns[i].addEventListener("click", () => change_exampel_layers("5", "5", "10"))
}






//
