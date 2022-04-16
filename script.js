const unchecked_image = "images/unchecked.png"
const checked_image = "images/checked.png"

//Creo un object con campi preimpostati per la risposta
const check = {
    one: undefined,
    two: undefined,
    three: undefined
};

function allButMe(matrix, tipe) {
    for (const box of list) {

        if (matrix === box.dataset.questionId) { //siamo in questa matrice

            if (tipe === box.dataset.choiceId) {            //l'elemento è quello cliccato
                const checkBox = box.querySelector("img.checkbox");
                box.classList.remove('unchecked');
                box.removeEventListener("click", choice);    //viene disattivato
                checkBox.src = checked_image;

            }
            else {                                     //tutti gli altri elementi
                const checkBox = box.querySelector("img.checkbox");
                box.addEventListener("click", choice); //attivano il listen
                box.classList.add('unchecked');       //vengono sfocati
                checkBox.src = unchecked_image;

            }


        }
    }
}

function SilenceAndPush(ev) {

    const matrix = ev.dataset.questionId;  //Matrice 1,2,3
    const tipe = ev.dataset.choiceId;     //scelta  1--->9
    switch (matrix) {

        case 'one':
            check.one = tipe;  //Salva nell'indice 1 (push)
            allButMe(matrix, tipe); // ->seleziona l'elemento e deseleziona gli altri
            break;

        case 'two':
            check.two = tipe;  //Salva nell'indice 2
            allButMe(matrix, tipe); // ->seleziona l'elemento e deseleziona gli altri

            break;

        case 'three':
            check.three = tipe; //Salva nell'indice 3
            allButMe(matrix, tipe); // ->seleziona l'elemento e deseleziona gli altri
            break;

        default:
            console.log('Qualcosa è andato storto! :(');
    }


}

// dopo il click si innesca la funzione di scelta
function choice(event) {

    SilenceAndPush(event.currentTarget);

    if (check.one !== undefined && check.two !== undefined && check.three !== undefined) { // SE la scelta è completa
        const res = createResults();       //Calcola il risultato
        showResults(res);   //Mostra il risultato

        for (const box of list) {  //Spegne i 27 box
            box.removeEventListener("click", choice);
        }
    }
}

function createResults() {
    //Ci sono 5 casi possibili (DIMOSTRAZIONE SOTTO)
    const a = check.one;
    const b = check.two;
    const c = check.three;
    let res = undefined;

    //che si riducono in 2 casi 
    if (a !== b && b === c) {
        res = b;
    } else {
        res = a;
    }
    return res;

    /*  Dimostrazione
    if (a!==b &&  b!==c){ //tutti diversi-> A
        res=a;
    }else if (a===b===c) { // tutti uguali -> A
        res=a;
    }else if (a===b && b!==c) { //a=b -> A
        res=a;
    }else if (a!==b && b===c) { //b=c ->UNICO CASO IN CUI VINCE B
        res=b;
    }else if (a===c && a !== b) {  //a=c -> A
        res=a;
    } else {
      console.log("Fine Dimostrazione ")  
    }
    */
}

function showResults(res) {

    //stampo i risultati
    const result = document.querySelector('#result'); //Mi aggancio all id dei risultati
    result.classList.add('resultShow');

    //aggancio h1 in res
    const title = result.querySelector('h1');
    //aggancio div in res
    const description = result.querySelector('div');

    //Estraggo i risultati
    title.textContent = RESULTS_MAP[res].title;
    description.textContent = RESULTS_MAP[res].contents;

    //creo tasto
    const ResetButton = document.createElement('button');
    //inserisco il testo
    ResetButton.textContent = "Ricomincia il quiz";
    //aggiungo class css
    ResetButton.classList.add('button');
    ResetButton.classList.add('button:hover');

    //Aggiungo figlio a result
    result.appendChild(ResetButton);
    //aggiungo il listen per il reset()
    ResetButton.addEventListener("click", reset);

};

function reset(ev) {

    //resetto le scelte
    check.one = undefined;
    check.two = undefined;
    check.three = undefined;

    const ResetButton = document.querySelector('button');
    ResetButton.removeEventListener("click", reset);
    ResetButton.remove();

    const result = document.querySelector('#result');
    result.querySelector('h1').innerHTML = ''; //svuoto
    result.querySelector('div').innerHTML = ''; //svuoto
    result.classList.remove('resultShow');
    result.classList.add('resultHidden');

    for (const box of list) {  //27 box

        //rimuovo tutte le sfocature e riattivo gli ascolti
        const checkBox = box.querySelector("img.checkbox");
        box.classList.remove('unchecked');
        checkBox.src = unchecked_image;
        box.addEventListener("click", choice);
    }
}

//Creo la lista globale della griglia 3*9 
const list = document.querySelectorAll('.choice-grid div');
for (const box of list) {  //27 box
    box.addEventListener("click", choice);

}