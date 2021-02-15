
const text_toggle = document.querySelector("#text_toggle");

const half_paragrpah = document.querySelector("#half_text");
const full_paragraph = document.querySelector("#full_text");

let half_text = half_paragrpah.innerHTML;
let full_text = full_paragraph.innerHTML;
full_paragraph.innerHTML = "";

let textAdded = false;
function add_text() {
    if(textAdded === false){
      half_paragrpah.innerHTML += full_text;
      text_toggle.innerHTML = "Show less"
      textAdded = true;
    }

    else{
      half_paragrpah.innerHTML = half_text;
      text_toggle.innerHTML = "Read more"
      textAdded = false;
    }
}


text_toggle.addEventListener("click", add_text);
