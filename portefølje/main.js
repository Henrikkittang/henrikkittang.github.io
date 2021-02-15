
const nav = document.querySelector("nav");
const meny_btn = document.querySelector("#meny_btn");
const forside_tekst = document.querySelector(".forside_tekst");
const forside_info = document.querySelector(".forside_info");
const nav_wrappers = document.querySelectorAll(".nav_wrapper");
const forside_animasjon = document.querySelector('.forside_animasjon');

function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

function toggleForsideTekst(){
    const tekst_top = getOffset(forside_tekst).top;
    const info_top = getOffset(forside_info).top;

    if(tekst_top > info_top){
        forside_tekst.style.display = "none";
    }else{
        forside_tekst.style.display = "block";
    }
}

window.onscroll = toggleForsideTekst

window.onresize = () => {
    if(window.innerWidth > 601){
        nav_wrappers.forEach(wrapper => wrapper.style.display = 'block');       
        forside_tekst.style.top = '160px';   
    }
}
meny_btn.addEventListener('click', () =>{
    const displayType = nav_wrappers[0].style.display;

    console.log(window.innerWidth);
    if(window.innerWidth < 601){
        if(displayType == 'block'){
            nav_wrappers.forEach(wrapper => wrapper.style.display = 'none'); 
            forside_tekst.style.top = '-5px';      
        }else{
            nav_wrappers.forEach(wrapper => wrapper.style.display = 'block');       
            forside_tekst.style.top = '160px';   
        }
    }
});


function randint(min, max){
    return Math.floor(Math.random() * (max - min)) + min; 
}


function makeSqaures(){
    for(let i = 0; i < 20; i++){
        const div = document.createElement('div');

        div.style.width = randint(20, 90).toString() + 'px';
        div.style.height = randint(20, 90).toString() + 'px';
        div.style.left = randint(0, 90).toString() + '%';
        div.style.top = randint(0, 90).toString() + '%';
        // div.style.transform = 'translate(-50%, -50%)';

        div.style.position = 'absolute';
        div.style.backgroundColor = `rgb(${randint(0, 255)}, ${randint(0, 255)}, ${randint(0, 255)})`;
        div.animate([
            {transform: 'scale(1.1)'}, 
            {transform: 'scale(0.9)'}, 
            {transform: 'scale(1.1)'}, 
        ], { 
            // timing options
            duration: randint(4000, 6000),
            iterations: Infinity
        });
        forside_animasjon.appendChild(div);
    }
}

function makeStars(){
    for(let i = 0; i < 200; i++){
        let newStar = document.createElement('div');
        newStar.classList.add('star');

        newStar.style.top = randint(1, 99).toString() + '%';
        newStar.style.left = randint(1, 99).toString() + '%';

        newStar.style.borderRadius = '12px';
                
        newStar.animate([
            {opacity:'0'}, 
            {opacity:'1'},
            {opacity:'0'}
        ], { 
            // timing options
            duration: randint(2000, 6000),
            iterations: Infinity
        });

        forside_animasjon.appendChild(newStar);
    }
}

window.onload = () =>{
    toggleForsideTekst();

    
    
    makeStars();
}
makeStars();


/**/
