
//Tabela de custos
let costTable = [


    [8, 32, 29, 25, 10, 12, 19, 10, 0],
    [28, 35, 20, 30, 9, 30, 26, 18, 0],
    [14, 22, 25, 24, 24, 9, 9, 25, 0],
    [30, 15, 12, 18, 29, 9, 27, 21, 0],
    [13, 13, 11, 31, 25, 13, 24, 23, 0],
    [29, 10, 32, 9, 33, 22, 33, 19, 0],
    [31, 13, 16, 8, 21, 34, 35, 26, 0],
    [16, 22, 21, 23, 11, 19, 23, 19, 0],
    [18, 10, 28, 31, 14, 11, 9, 27, 0],
    [19, 26, 12, 27, 26, 27, 26, 33, 0],
    [22, 23, 12, 12, 34, 16, 33, 27, 0],
    [29, 20, 22, 10, 10, 19, 21, 34, 0],

];

let auxiliarTable = [


    [8, 32, 29, 25, 10, 12, 19, 10, 0],
    [28, 35, 20, 30, 9, 30, 26, 18, 0],
    [14, 22, 25, 24, 24, 9, 9, 25, 0],
    [30, 15, 12, 18, 29, 9, 27, 21, 0],
    [13, 13, 11, 31, 25, 13, 24, 23, 0],
    [29, 10, 32, 9, 33, 22, 33, 19, 0],
    [31, 13, 16, 8, 21, 34, 35, 26, 0],
    [16, 22, 21, 23, 11, 19, 23, 19, 0],
    [18, 10, 28, 31, 14, 11, 9, 27, 0],
    [19, 26, 12, 27, 26, 27, 26, 33, 0],
    [22, 23, 12, 12, 34, 16, 33, 27, 0],
    [29, 20, 22, 10, 10, 19, 21, 34, 0],

];

let empresas = ["Empresa1","Empresa2","Empresa3","Empresa4","Empresa5","Empresa6","Empresa7","Empresa8","Empresa9","Empresa10","Empresa11","Empresa12"];

let ofertantes = ["Ofertante1","Ofertante2","Ofertante3","Ofertante4","Ofertante5","Ofertante6","Ofertante7","Ofertante8"];





let postionNeed;
let positionAvailability;
let valueAvailability;
let valueNeed;
let resultDiff;

const M = 9999;

// necessidade --> coluna
let need = [3280, 1650, 3830, 6180, 6600, 5990, 4510, 6410, 3680, 6390, 5560, 5410];

// disponibilidade ---> linha
let availability = [8100, 7500, 6300, 5100, 7200, 7000, 9700, 6300, 2290]

let columnDummyIsNull = true;

let dummyColummnAux = [];

let auxTable = [];


let table = vogel(costTable);


let finalTable = finalCostTable(costTable, table);


function vogel(table) {


    let penaltyColumn = getPenaltyColumn(table);
    let penaltyLine = getPenaltyLine(table);



    let maxValueColumn = Math.max(...penaltyColumn);
    let maxValueLine = Math.max(...penaltyLine);


    if (maxValueColumn >= maxValueLine) {


        let postionValueMaxLine = penaltyColumn.indexOf(maxValueColumn);

        let postionValueMinColumn = getPositionValueMinLine(table, postionValueMaxLine);

        resultDiff = need[postionValueMaxLine] - availability[postionValueMinColumn];

        table[postionValueMaxLine][postionValueMinColumn] = availability[postionValueMinColumn];
        valueAvailability = availability[postionValueMinColumn];



        if (Math.sign(resultDiff) === 1) {
            availability[postionValueMinColumn] = 0;
            need[postionValueMaxLine] = resultDiff;

        } else if (Math.sign(resultDiff) === -0 || Math.sign(resultDiff) === 0) {
            availability[postionValueMinColumn] = 0;
            need[postionValueMaxLine] = resultDiff;
        } else {
            availability[postionValueMinColumn] = Math.abs(resultDiff);
            table[postionValueMaxLine][postionValueMinColumn] = need[postionValueMaxLine];
            valueNeed = need[postionValueMaxLine];
            need[postionValueMaxLine] = 0

        }

        postionNeed = postionValueMaxLine;
        positionAvailability = postionValueMinColumn;

    } else {

        let positionValueMaxColumn = penaltyLine.indexOf(maxValueLine);

        let positionValueMinLine = getPositionValueMinColumn(table, positionValueMaxColumn);

        resultDiff = need[positionValueMinLine] - availability[positionValueMaxColumn];


        table[positionValueMinLine][positionValueMaxColumn] = availability[positionValueMaxColumn];
        valueAvailability = availability[positionValueMaxColumn];


        if (Math.sign(resultDiff) === 1) {
            availability[positionValueMaxColumn] = 0;
            need[positionValueMinLine] = resultDiff;

        } else if (Math.sign(resultDiff) === -0 || Math.sign(resultDiff) === 0) {
            availability[positionValueMaxColumn] = 0;
            need[positionValueMinLine] = resultDiff;
        } else {
            availability[positionValueMaxColumn] = Math.abs(resultDiff);
            table[positionValueMinLine][positionValueMaxColumn] = need[positionValueMinLine];
            valueNeed = need[positionValueMinLine];
            need[positionValueMinLine] = 0;

        }
        postionNeed = positionValueMinLine;
        positionAvailability = positionValueMaxColumn;

    }



    if (need[postionNeed] === 0) {

        for (let j = 0; j < table[0].length; j++) {
            if (table[postionNeed][j] != valueNeed && table[postionNeed][j] < 50) {
                table[postionNeed][j] = 0;
            }

        }

    }

    if (availability[positionAvailability] === 0) {

        for (let i = 0; i < table.length; i++) {

            if (table[i][positionAvailability] != valueAvailability && table[i][positionAvailability] < 50) {
                table[i][positionAvailability] = 0;
            }
        }
    }

    //Remove a coluna dummy após a primeira iteração
    if (columnDummyIsNull) {
        removeColumnDummy(table);
        for (let i = 0; i < table.length; i++) {
            let lineTable = [];
            for (let j = 0; j < table[0].length - 1; j++) {
                lineTable.push(table[i][j])
            }
            auxTable.push(lineTable);
        }
        table = [];
        table = auxTable;
        columnDummyIsNull = false;
    }

    if (!checkAvilability(availability)) {
        vogel(table);
    } else {
        for (let i = 0; i < table.length; i++) {
            table[i].push(dummyColummnAux[i]);
        }
    }

    return table;
}


//=========================Funções Auxiliares==============================

//cria a coluna de penalidade na tabela de custos
function getPenaltyColumn(table) {
    let currentLine = [];
    let lineAux = [];
    let orderedLine = [];
    let difference;
    let penaltyColumn = [];

    for (let i = 0; i < table.length; i++) {
        currentLine = [];
        lineAux = [];
        for (let j = 0; j < table[i].length; j++) {
            if (columnDummyIsNull) {
                currentLine.push(table[i][j]);
            } else {
                if (table[i][j] === 0) {
                    currentLine.push(M)
                } else {
                    currentLine.push(table[i][j])
                }
            }

        }
        orderedLine = orderedValues(currentLine, lineAux);
        difference = differenceMin(orderedLine);
        penaltyColumn.push(difference);
    }
    return penaltyColumn;
}


//cria a linha de penalidade na tabela de custos
function getPenaltyLine(table) {
    let currentColumn = [];
    let columnAux = [];
    let orderedColumn = [];
    let difference;
    let penaltyLine = [];

    for (let j = 0; j < table[0].length; j++) {
        currentColumn = [];
        columnAux = [];

        for (let i = 0; i < table.length; i++) {

            if (columnDummyIsNull) {
                currentColumn.push(table[i][j]);
            } else {
                if (table[i][j] === 0) {
                    currentColumn.push(M)
                } else {
                    currentColumn.push(table[i][j])
                }
            }

        }

        orderedColumn = orderedValues(currentColumn, columnAux);

        difference = differenceMin(orderedColumn);

        penaltyLine.push(difference);
    }
    return penaltyLine;

}

//retorna a posição do valor minimo de uma linha da tabela
function getPositionValueMinLine(table, linePosition) {
    let lineAux = [];
    let minValueLine;
    let minValuePosition;


    for (let j = 0; j < table[linePosition].length; j++) {
        if (columnDummyIsNull) {
            lineAux.push(table[linePosition][j])
        } else {
            if (table[linePosition][j] === 0) {
                lineAux.push(M);
            } else {
                lineAux.push(table[linePosition][j]);
            }
        }

    }

    minValueLine = Math.min(...lineAux);

    minValuePosition = lineAux.indexOf(minValueLine);

    return minValuePosition;

}

//retorna a posição do valor minimo de uma coluna da tabela
function getPositionValueMinColumn(table, columnPosition) {
    columnAux = [];
    let minValueColumn;
    let minValuePosition;

    for (let i = 0; i < table.length; i++) {

        if (columnDummyIsNull) {
            columnAux.push(table[i][columnPosition]);
        } else {

            if (table[i][columnPosition] === 0) {
                columnAux.push(M);
            } else {
                columnAux.push(table[i][columnPosition]);
            }
        }
    }
    minValueColumn = Math.min(...columnAux)

    minValuePosition = columnAux.indexOf(minValueColumn);

    return minValuePosition;
}

//retorna um array em ordem crescente
function orderedValues(array, arrayAux) {
    let valueMin;
    let positionValueMin;

    valueMin = Math.min(...array)
    arrayAux.push(valueMin);
    positionValueMin = array.indexOf(valueMin);

    array.splice(positionValueMin, 1);


    if (array.length > 0) {
        orderedValues(array, arrayAux);
    }
    return arrayAux;
}

//retorna a diferença entre os dois valores mínimos de um array --> linha
function differenceMin(array) {
    let difference = 0;

    for (let i = 0; i < 2; i++) {
        difference = array[i] - difference;
    }

    if (Math.abs(difference) > 1000) {
        return difference = 0;

    }

    return Math.abs(difference);
}

//remove a coluna dummy da tabela e armazena ela em outro array
function removeColumnDummy(table) {
    for (let i = 0; i < table.length; i++) {
        dummyColummnAux.push(table[i][table[0].length - 1]);
    }
}


//Verifica se a linha (array) da disponibilidade foi zerada
function checkAvilability(availability) {
    let isZeroed = true;
    availability.forEach(element => {
        if (element !== 0) {
            isZeroed = false;
        }
    });

    return isZeroed;
}

//Monta a tabela final de custos em R$
function finalCostTable(initialCostTable, finalCostTable) {

    let auxFinalCostTable = [];
    let line;
    for (let i = 0; i < initialCostTable.length; i++) {
        line = [];
        for (let j = 0; j < initialCostTable[0].length; j++) {
            line.push(auxiliarTable[i][j] * finalCostTable[i][j])
        }
        auxFinalCostTable.push(line)
    }

    return auxFinalCostTable;
}

//Calcula o custo total 
function totalCost(table) {

    let sumTotalCost =0;
    for(let i=0; i<table.length; i++){
        for(let j =0; j<table[0].length; j++){
            sumTotalCost+= table[i][j];
        }
    }
    return sumTotalCost;
}


function showTablePrice(){

let html = "<table>"
let cont=0 

html += "<tr>"
html += "<td>" + "Empresa/Ofertante" + "</td>"
while(cont != (auxiliarTable[0].length-1)){
    html += "<td>" + ofertantes[cont] + "</td>"
    cont++
}
html += "</tr>"

for (let i = 0; i < auxiliarTable.length; i++) {
html += "<tr>"
html += "<td>" + empresas[i] + "</td>"
for (let j = 0; j < (auxiliarTable[0].length -1); j++) {
    if(finalTable[i][j] != 0){
    html += "<td color='red'>" + finalTable[i][j] + "</td>";
    }else{
        html += "<td>" + finalTable[i][j] + "</td>";
    }
}
html += "</tr>"
}
html += "</table>"

document.getElementById("box").style.visibility= "visible";
document.getElementById("showResult").innerHTML = html;
}

function showFinalTable(){

    let html = "<table>"
    let cont=0 
    
    html += "<tr>"
    html += "<td>" + "Empresa/Ofertante" + "</td>"
    while(cont != (auxiliarTable[0].length-1)){
        html += "<td>" + ofertantes[cont] + "</td>"
        cont++
    }
    html += "<td>" + "Não Entregue" + "</td>"
    html += "</tr>"

    for (let i = 0; i < auxiliarTable.length; i++) {
    html += "<tr>"
    html += "<td>" + empresas[i] + "</td>"
    for (let j = 0; j < auxiliarTable[0].length; j++) {
        if(table[i][j] != 0){
        html += "<td color='red'>" + table[i][j] + "</td>";
        }else{
            html += "<td>" + table[i][j] + "</td>";
        }
    }
    html += "</tr>"
    }
    html += "</table>"
    
    document.getElementById("box").style.visibility= "visible";
    document.getElementById("showResult").innerHTML = html;
    }

    function finalValue(){

    let html = "<h1>"+"R$ "+ totalCost(finalTable) +",00"+"</h1>"
    document.getElementById("box").style.visibility= "visible";
    document.getElementById("showResult").innerHTML = html;
    }