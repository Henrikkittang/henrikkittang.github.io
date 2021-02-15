const db = firebase.database();
const chat = db.ref("FirstProject");

const inpBtn = document.querySelector("#inpBtn");
const main = document.querySelector("#main")

function lastOpp(event) {
    event.preventDefault();

    let navn = document.querySelector("#inpNavn").value;
    let tekst = document.querySelector("#inpTekst").value;

    nyMelding = {
        "navn": navn,
        "melding": tekst
    };

    chat.push(nyMelding);
}

function visMelding(snapshot) {
    let data = snapshot.val();
    main.innerHTML += ` <p> <b>${data.navn}</b>: ${data.melding} </p> `
}


inpBtn.addEventListener("click", lastOpp);
chat.on("child_added", visMelding)
