
let comp_btn = document.querySelector("#comp_btn");
let copy_btn = document.querySelector("#copy_btn");
let input_text = document.querySelector("#input_text");
let output_text = document.querySelector("#output_text");

comp_btn.addEventListener("click", addText)
copy_btn.addEventListener("click", copyText)

function copyText() {

  output_text.select();

  document.execCommand("copy");

}

function addText() {
    let text = input_text.value;

    text = compressText(text);

    output_text.innerHTML = text;
}

function compressText(text) {
    // returns a list with the seperate lines
    let lines = text.split("\n");
    let dicts = [];

    // Removes whitespace and adds makes key-value pairs
    for(let i = 0; i < lines.length; i++){
        lines[i] = lines[i].trim();
        if(lines[i] === ""){
            lines.splice(i, 1);
            i--;
        }
    }

    for(let i = 0; i < lines.length; i++){
        let keyVal = lines[i].split(": ");
        if(keyVal.length > 1){
            keyVal[1] = keyVal[1].trim();
            lines[i] = keyVal[0] + ":" + keyVal[1]
        }
    }

    let lister = [];
    let new_string = "";
    let cur_string;
    for(let i = 0; i < lines.length; i++){
        new_string += lines[i];
        if(lines[i] === "}"){
            if(new_string[new_string.length-2] === ";"){
                new_string = new_string.slice(0, -2) + new_string[new_string.length-1];
            }
            lister.push(new_string);
            new_string = "";
        }
    }

    new_string = "";
    for(let i = 0; i < lister.length; i++){
        new_string += lister[i] + "\n";
    }

    return new_string;
}


/**/
