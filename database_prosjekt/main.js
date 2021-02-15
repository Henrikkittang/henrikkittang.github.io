
//firebase
const db = firebase.database();
const elementer = db.ref("elements");
const profiler = db.ref("profiler");
const meldinger = db.ref("meldinger");

//Periodesystemet
const periodesystem_øvre = document.querySelector(".periodesystem_øvre");
const periodesystem_nedre = document.querySelector(".periodesystem_nedre");
const popup_vindu = document.querySelector("#periodesystem_popup");

const periodesystem_søkeknapp = document.querySelector("#periodesystem_søkeknapp")
let periodesystem_feltInnhold = document.querySelector("#periodesystem_søkefelt");

let alleGrunnstoffer = {};

//Nav bar
const toggle_knapp = document.querySelector("#toggle_knapp");
const side_nav = document.querySelector(".side_nav");
let nav_state = true;

const body = document.querySelector("body");

//login
const login_brukernavn = document.querySelector("#login_brukernavn");
const login_passord = document.querySelector("#login_passord");
const login_btn = document.querySelector("#login_btn");

const reg_brukernavn = document.querySelector("#reg_brukernavn");
const reg_passord = document.querySelector("#reg_passord");
const reg_bekreft_passord = document.querySelector("#reg_bekreft_passord");
const reg_btn = document.querySelector("#reg_btn");

var registrerte_brukernavn = [];    
var registrerte_brukere = {};

// Forum
const forum_medlinger = document.querySelector(".forum_medlinger");
const forum_inpFelt = document.querySelector("#forum_inpFelt");
const forum_inpBtn = document.querySelector("#forum_inpBtn");

let url_string = window.location.href;
let url = new URL(url_string);
let forum_brukernavn = url.searchParams.get("brukernavn");
let forum_passord = url.searchParams.get("passord")
let forum_global_sorteringstype = "begrens";

//Index
const index_avsnitt_halv = document.querySelector("#index_avsnitt_halv");
const index_avsnitt_hel = document.querySelector("#index_avsnitt_hel");
const index_text_btn = document.querySelector("#index_text_toggle");
let textLagtTil = false;

if(index_avsnitt_halv){
    var halv_tekst = index_avsnitt_halv.innerHTML;
    var full_text = index_avsnitt_hel.innerHTML;
    index_avsnitt_hel.innerHTML = "";
}

function toggle_nav(){
    //Åpner og lukker navbaren
    let width = getComputedStyle(side_nav).width // finner bredden på navbaren
    console.log(width);
    if(nav_state === false){              // Hvis navbaren er åpen, lukk den
        side_nav.style.left = "-100%";
        //body.style.marginLeft = "30px"
        nav_state = true;
    }
    else{                                 // ellers åpne den
        side_nav.style.left = "0%";
        //body.style.marginLeft = width;
        nav_state = false;
    }
}

function toggle_text() {
    //Viser mer eller mindre tekst når man trykker på knappen under teksten
    if(textLagtTil === false){                         // Hvis den bare viser halve teksten
      index_avsnitt_halv.innerHTML += full_text;       // så lekk til resten
      index_text_btn.innerHTML = "Vis mindre"
      textLagtTil = true;
    }

    else{                                             // ellers bare vis halve teksten
      index_avsnitt_halv.innerHTML = halv_tekst;
      index_text_btn.innerHTML = "Vis mer"
      textLagtTil = false;
    }
}

function genererPeriodesystem(snapshot) {
    // Legger til alle grunnstoff elementene i html-en
    let grunnstoff = snapshot.val();
    let nyDiv = document.createElement("div");
    nyDiv.classList.add("grunnstoff");

    alleGrunnstoffer[grunnstoff.name] = snapshot;

    // Legge usynelige diver med span for å formatere periodesystem riktig
    if(grunnstoff.number === 2){
        let span_div = document.createElement("div");
        span_div.style.gridColumn = "span 16";
        span_div.setAttribute("class", "span_div")
        periodesystem_øvre.appendChild(span_div);
    }

    // Samme som over bare med andre rader
    else if(grunnstoff.number === 5 | grunnstoff.number === 13){
        let span_div = document.createElement("div");
        span_div.style.gridColumn = "span 10";
        span_div.setAttribute("class", "span_div")
        periodesystem_øvre.appendChild(span_div);
    }

    const colors = {
        "diatomic nonmetal": "orange",
        "polyatomic nonmetal": "orange",
        "noble gas": "lightblue",
        "alkali metal": "green",
        "alkaline earth metal": "purple",
        "metalloid": "yellow",
        "transition metal": "yellow",
        "post-transition metal": "yellow",
        "lanthanide": "yellow",
        "actinide": "yellow",
    }

    const phaseColor = {"Gas": "red", "Liquid": "lightgrey", "Solid": "black"}

    nyDiv.style.backgroundColor = colors[grunnstoff.category];

    // Helt standar legge til innhold i div-er. Div-en er delkarert helt øverst
    // Legger til number, tilstand og forkortelse, pluss en knapp til å åpne popup-en
    let key = snapshot.key;
    nyDiv.innerHTML +=`
        <button type="button" onclick='visValgtGrunnstoff("${key}")'>
            <p>${grunnstoff.number} </p>
            <h2 style="color: ${phaseColor[grunnstoff.phase]}";> ${grunnstoff.symbol} </h2>
        </button>
    `;

    // Periodesystem består av to grids, hovedsystemet som ligger over og det mindre
    // som ligger under. Disse if-testene tester på grunnstoffets nummer for å plassre
    // dem i riktig grid
    if(grunnstoff.number > 57 & grunnstoff.number < 72 | grunnstoff.number > 89 & grunnstoff.number < 104){
        periodesystem_nedre.appendChild(nyDiv);
    }
    else{
        periodesystem_øvre.appendChild(nyDiv);
    }
}

function visPeriodesystem() {
    periodesystem_øvre.innerHTML = "";
    periodesystem_nedre.innerHTML = "";
    elementer.on("child_added", genererPeriodesystem);
}

function søkPeriodesystem() {
    if(periodesystem_feltInnhold.value === ""){
        visPeriodesystem();
        return;
    }

    let keys = Object.keys(alleGrunnstoffer);
    for(let i = 0; i < keys.length; i++){
        if(keys[i] === periodesystem_feltInnhold.value){
            periodesystem_øvre.innerHTML = "";
            periodesystem_nedre.innerHTML = "";
            genererPeriodesystem(alleGrunnstoffer[periodesystem_feltInnhold.value]);
        }
    }
}

function oppdaterPeriodesystem() {
    if(periodesystem_søkefelt.value === ""){
        visPeriodesystem();
    }
}

function genererPopup(snapshot) {
    // Legger til riktig innhold på popup-en og setter den til display: block
    let data = snapshot.val();

    popup_vindu.innerHTML += `
        <h1> ${data.name} </h1>
        <ul id="valgtGrunnstoff_liste">
            <li> <b> Oppgdaget av: </b> ${data.discovered_by} </li>
            <li> <b> Beskrivelse: </b> ${data.appearance} </li>
            <li> <b> Atommasse: </b> ${data.atomic_mass} u </li>
            <li> <b> Kokepunkt: </b> ${data.boil} °C </li>
            <li> <b> Smeltepunkt: </b> ${data.melt} °C </li>
            <li> <b> Tetthet: </b> ${data.density} kg/m^3 </li>
        </ul>
        <p> ${data.summary} </p>
        <button type="button" onclick="lukk_popup()">Lukk</button>
        `;

    popup_vindu.style.display = "block";
}

function visValgtGrunnstoff(id) {
    // Knappen til hvert grunnstoff har sender en id
    // Id-en brukes til å refere til et objekt i databasen som igjen
    // Sendes genererPopup funksjonen i en funksjon for å vises på skjermen
    popup_vindu.innerHTML = "";
    const valgtGrunnstoff = db.ref("elements/" + id)
    valgtGrunnstoff.on("value", genererPopup);
}

function lukk_popup() {
    // Lukker popup-vinduet
    popup_vindu.style.display = "none";
}

function reg_bruker() {
    // Funksjonen for registrerings delen av innloggingsfeltet
    let brukernavn = reg_brukernavn.value;
    let passord_1 = reg_passord.value;
    let passord_2 = reg_bekreft_passord.value;

    // Hvis passordet er blankt eller feltene ikke stemmer overens, så gi beskjedd til bruker
    if(passord_1 !== passord_2 | passord_1 === "" | passord_2 === "" | brukernavn === ""){
        alert("Passordene er ikke like eller et av feltene er ikke fylt ut!");
        return;
    }

    // Hvis brukernavnet allerede er registrert i databasen så må bruker velge et annet
    for(let idx = 0; idx < registrerte_brukernavn.length; idx++){
        if(registrerte_brukernavn[idx] === brukernavn){
            alert("Brukernavnet er allerede tatt!");
            return;
        }
    }

    // illusjonen av sikkerhet igjen
    let passord = passord_1;

    nyBruker = {
        "brukernavn": brukernavn,
        "passord": passord
    };

    profiler.push(nyBruker);

    reg_brukernavn.value = "";
    reg_passord.value = "";
    reg_bekreft_passord.value = "";

    alert("Bruker registrert!");
}

function logg_inn() {
    // Funksjonen for innlogging delen av innloggingsfeltet
    let brukernavn = login_brukernavn.value;
    let passord = login_passord.value;

    // looper gjennom alle registrert brukernavn, hvis brukernanvet ikke finnes
    // så gi beskjedd til bruker
    bruker_registrert = false;
    for(let idx = 0; idx < registrerte_brukernavn.length; idx++){
        if(registrerte_brukernavn[idx] === brukernavn){
            bruker_registrert = true;
            break;
        }
    }
    if(bruker_registrert === false){
        alert("Du er ikke registrert");
        return;
    }


    let id = registrerte_brukere[brukernavn]
    let bruker = db.ref("profiler/" + id)

    // Hvis passordet ikke stemmer med det i databasen så gi beskjedd til bruker
    bruker.on("value", function(snapshot) {
        let data = snapshot.val()
        if(passord !== data.passord){
            alert("Feil passord");
            return;
        }
        location.href = `forum.html?brukernavn=${data.brukernavn}&passord=${data.passord}`;
    })
}

function finnBrukernavn(snapshot) {
    // Legger til alle brukernavnene og tilhørende primærnøkklene til en liste og et objekt
    let data = snapshot.val();
    let key = snapshot.key;
    registrerte_brukernavn.push(data.brukernavn);
    registrerte_brukere[data.brukernavn] = key;
}

function genererMeldinger(snapshot, rekkefølge) {
    // Viser meldingene sendte meldinger på html siden
    // Den viser meldingene enten i "kronologisk" eller sortert rekkefølge
    // Jeg valgte heller å legge til en ekstra paramter så jeg slapp å skrive
    // nesten den samme funksjonen to ganger
    let data = snapshot.val();

    let nyMelding = document.createElement("article"); // lager et nytt articel element
    nyMelding.classList.add("melding");  // Gir den melding klassen

    // Legger til innholdet i elementet
    nyMelding.innerHTML += `
        <section>
            <h2>${data.brukernavn}</h2>
            <p> ${data.tekst} </p>
        </section>

        <hr>

        <section class="forum_stemme_knapper">
            <div>
                    <button type="button" id="stemme_btn" onclick='stemPåInnlegg("${snapshot.key}", "upVote")'> <i class="fa fa-thumbs-up"></i> </button>
                <p> ${data.upvotes} </p>
            </div>

            <div>
                <button type="button" id="stemme_btn" onclick='stemPåInnlegg("${snapshot.key}", "downVote")'> <i class="fa fa-thumbs-down"></i> </button>
                <p> ${data.downvotes} </p>
            </div>
        </section>
    `;

    // Vis den skal i sortert rekkefølge, så legg til det nye elementet helt på starten
    if(rekkefølge === "sortert"){
        forum_medlinger.insertBefore(nyMelding, forum_medlinger.childNodes[0]);

    }

    // Ellers så legg den til helt til slutt
    else{
        forum_medlinger.insertBefore(nyMelding, forum_medlinger.childNodes[forum_medlinger.length - 1]);
    }
}

function visMeldinger() {
    // Velger de 10 første meldingene og sender dem til generings funksjonen rett over
    forum_medlinger.innerHTML = "";
    meldinger
        .limitToLast(10)
        .on("child_added", genererMeldinger);
}

function sendMelding() {
    // Sender ny melding til databasen og kaller på å visMeldinger funksjonen
    // for å alltid bare viser de 10 første
    let tekst = forum_inpFelt.value;

    if(tekst.length > 1300){
        alert("Teksten er for lang");
        return;
    }

    if(tekst === ""){return;}

    // Sjekker om passordet og brukernavnet som hentes fra URL-en stemmer overens
    // Forhindrer til en hvis grad at man ikke kan stjele brukernavn ved å gjøre om URL-en
    let gydligBruker = false;
    let bruker = db.ref("profiler/" + registrerte_brukere[forum_brukernavn])
    bruker
        .on("value", function(snapshot) {
            let data = snapshot.val();
            if(data.passord != forum_passord){
                alert("Du er ikke logget inn");
                location.href = `login.html`;
            }
            else{
                gyldigBruker = true;
            }
    });

    if(gyldigBruker === false){return;}


    let nyMelding = {
        "brukernavn": forum_brukernavn,
        "brukerId": registrerte_brukere[forum_brukernavn],
        "tekst": tekst,
        "upvotes": 0,
        "downvotes": 0,
        "brukere_stemt": [registrerte_brukere[forum_brukernavn]]
    }

    forum_inpFelt.value = "";
    meldinger.push(nyMelding);
    visMeldinger();
}

function forum_sortering(type) {
    forum_global_sorteringstype = type;
    // Denne funksjon har ingen eventlistner men heller en onclick i html-en
    // Det er fordi jeg da slipper å skrive en ny funksjon for hver sortering
    // Men heller kan gjøre if-tester i en funksjon og slippe å skrive ting flere ganger
    forum_medlinger.innerHTML = "";

    // Viser alle meldingene som er i databasen
    if(type === "alle"){
        meldinger
            .on("child_added", genererMeldinger);
    }

    // Viser de 10 siste meldingene som er i databasen
    else if(type === "begrens"){
        meldinger
            .limitToLast(10)
            .on("child_added", genererMeldinger);
    }

    // Viser de 10 meldingene med flest downvotes eller upvotes
    else{
        meldinger
            .orderByChild(type)
            .limitToLast(10)
            .on("child_added", (snapshot) => genererMeldinger(snapshot, "sortert"));
    }
}

function stemPåInnlegg(id, handling) {
    let objekt; // Skal holde objektet fra databasen som har blitt stemmt på
    melding = db.ref("meldinger/" + id)
    // Henter ut objektet fra databasen
    melding
        .on("value",(snapshot) => {
            objekt = snapshot.val();
    })

    // Sjekker om brukeren har stemt på innlegget fra før av
    for(let idx = 0; idx < objekt.brukere_stemt.length; idx++){
        if(objekt.brukere_stemt[idx] === registrerte_brukere[forum_brukernavn]){
            return;
        }
    }

    // Sjekker om brukeren har stemm innlegget opp eller ned
    if(handling === "upVote"){objekt.upvotes += 1;}
    else if(handling === "downVote"){objekt.downvotes += 1}

    // Leger til brukeren blant de som har stemt på innelegget slik at de
    // ikke kan stemme igjen
    objekt.brukere_stemt.push(registrerte_brukere[forum_brukernavn]);

    // Erstatter det gamle objektet i databasen med det nye og oppdaterte
    melding.set(objekt);

    // Viser forandringene på nettsiden
    forum_sortering(forum_global_sorteringstype);
}

// Disse må legges i egne if-tester for ikke å gi feilmelding på nettsider de ikke
// har noe å gjøre
profiler.on("child_added", finnBrukernavn)
if(forum_inpBtn){forum_inpBtn.addEventListener("click", sendMelding)}
if(forum_medlinger){visMeldinger();}
if(reg_btn){
    reg_btn.addEventListener("click", reg_bruker);
    login_btn.addEventListener("click", logg_inn)}
if(periodesystem_øvre){visPeriodesystem();}
if(index_text_btn){index_text_btn.addEventListener("click", toggle_text);}
if(toggle_knapp){toggle_knapp.addEventListener("click", toggle_nav);}
if(periodesystem_søkeknapp){
    periodesystem_søkeknapp.addEventListener("click", søkPeriodesystem);
    periodesystem_søkefelt.addEventListener("input", oppdaterPeriodesystem);}
