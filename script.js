const selectedFile = document.getElementById("fileInput");
let failaVeids = "";
let found;
let pazinojums = document.getElementById("pazinojumuPanelis");
function setTableH(){
    // create table heading elements and insert into document
    const tabble = document.createElement("table");
    document.body.appendChild(tabble);
    const headerRow = document.createElement("tr");
    tabble.appendChild(headerRow);
    const th1 = document.createElement("th");
    th1.textContent = "Akta Nr";
    const th2 = document.createElement("th");
    th2.textContent = "Parauga Nr";
    const th3 = document.createElement("th");
    th3.textContent = "Datums";
    const th4 = document.createElement("th");
    th4.textContent = "Koka suga";
    const th5 = document.createElement("th");
    th5.textContent = "Koord1 (lon)";
    const th6 = document.createElement("th");
    th6.textContent = "Koord2 (lat)";
    const th7 = document.createElement("th");
    th7.textContent = "Kaitīgie organismi";
    headerRow.appendChild(th1)
    headerRow.appendChild(th2)
    headerRow.appendChild(th3)
    headerRow.appendChild(th4)
    headerRow.appendChild(th5)
    headerRow.appendChild(th6)
    headerRow.appendChild(th7)
}

function handleFiles() {
    // The files property of an input element returns a FileList
    if (!selectedFile.files[0]) {
        alert("fails nav izvēlēts");
    } else {
        const reader = new FileReader();
        reader.readAsText(selectedFile.files[0]);
        reader.onload = function() {
            const rawContent = reader.result;
            try {
                const readyContent = JSON.parse(rawContent);
                if (readyContent.features[0].properties["Koka suga"]){
                    failaVeids = "paraugi"
                    pazinojums.textContent = "Punktu (paraugu) fails. "
                } else if (readyContent.features[0].properties["Koku sugas"]){
                    failaVeids = "akti"
                    pazinojums.textContent = "Platību (aktu) fails. Koordinātas tiek parādītas kaut kādam vienam punktam apsekojumā. Paraugu numuri šeit nav paredzēti. "
                }
                setTableH()
                const tabble = document.getElementsByTagName("table")[0]
                const features = readyContent.features;
                const featureCount = features.length;
                if (failaVeids === "paraugi"){
                    const featureList = []
                    for (let i = 0; i < featureCount; i++) {                                                                           
                        found = false;
                        // ja tādas pašas koordinātas un akta numurs jau būs bijuši iepriekš, tad neta11isīs jaunu rindu, bet kabinās klāt pie iepriekšējās
                        for (let j = 0; j < featureList.length; j++){
                            if((features[i].properties["Akta nr"] == featureList[j].akts) 
                                && (features[i].geometry.coordinates[0] == featureList[j].koord1)
                                && (features[i].geometry.coordinates[1] == featureList[j].koord2)){
                                    const tabbleRows = document.getElementsByTagName("tr");
                                    const taaRinda = tabbleRows[j];
                                    rowCells = taaRinda.getElementsByTagName("td");
                                    if (features[i].properties["Parauga nr"] && features[i].properties["Parauga nr"] != "-"){
                                        const plusParaugaNr = "; " + features[i].properties["Parauga nr"];
                                        rowCells[1].textContent += plusParaugaNr;
                                    }
                                    const plusKokaSuga = "; " + features[i].properties["Koka suga"];
                                    rowCells[3].textContent += plusKokaSuga;
                                    found = true;
                                    break;
                            }
                        }
                        if (found == true){
                            continue;
                        }
                        const obj1 = {}
                        const rrow = document.createElement("tr")
                        tabble.appendChild(rrow);
                        const td1 = document.createElement("td");
                        td1.textContent = features[i].properties["Akta nr"];
                        obj1.akts = features[i].properties["Akta nr"] ;
                        const td2 = document.createElement("td");
                        td2.textContent = features[i].properties["Parauga nr"];
                        const td3 = document.createElement("td");
                        td3.textContent = features[i].properties["Parbaudes datums"];
                        const td4 = document.createElement("td");
                        td4.textContent = features[i].properties["Koka suga"];
                        const td5 = document.createElement("td");
                        td5.textContent = features[i].geometry.coordinates[0];
                        obj1.koord1 = features[i].geometry.coordinates[0]
                        const td6 = document.createElement("td");
                        td6.textContent = features[i].geometry.coordinates[1];
                        obj1.koord2 = features[i].geometry.coordinates[1]
                        const td7 = document.createElement("td");
                        td7.textContent = features[i].properties["Kaitīgie organismi"];
                        rrow.appendChild(td1);
                        rrow.appendChild(td2);
                        rrow.appendChild(td3);
                        rrow.appendChild(td4);
                        rrow.appendChild(td5);
                        rrow.appendChild(td6);
                        rrow.appendChild(td7);
                        featureList.push(obj1);                       
                    }
                }
                if (failaVeids === "akti"){
                    for (let i = 0; i < featureCount; i++){
                        const rrow = document.createElement("tr")
                        tabble.appendChild(rrow);
                        const td1 = document.createElement("td");
                        td1.textContent = features[i].properties["Akta nr"]
                        const td2 = document.createElement("td");
                        td2.textContent = "NA";
                        const td3 = document.createElement("td");
                        td3.textContent = features[i].properties["Pārbaudes datums"]
                        const td4 = document.createElement("td");
                        td4.textContent = features[i].properties["Koku sugas"]
                        const td5 = document.createElement("td");
                        const td6 = document.createElement("td");
                        if (features[i].geometry.type === "Polygon"){
                            td5.textContent = features[i].geometry.coordinates[0][0][0];
                            td6.textContent = features[i].geometry.coordinates[0][0][1];
                        }
                        if(features[i].geometry.type === "MultiPolygon"){
                            td5.textContent = features[i].geometry.coordinates[0][0][0][0];
                            td6.textContent = features[i].geometry.coordinates[0][0][0][1];
                        }
                        const td7 = document.createElement("td");
                        td7.textContent = features[i].properties["Kaitīgie organismi"]
                        rrow.appendChild(td1);
                        rrow.appendChild(td2);
                        rrow.appendChild(td3);
                        rrow.appendChild(td4);
                        rrow.appendChild(td5);
                        rrow.appendChild(td6);
                        rrow.appendChild(td7);
                    }
                }
                pazinojums.textContent += "Pārveidošana izdevās. Kopēt uz Exceli: iezīmēt visu Ctrl+a, kopēt Ctrl+c. Jauns fails - refresh"
            }
            catch(e) {
                //  Block of code to handle errors
                console.error(e);
                pazinojums.textContent = "Kaut kas neizdevās. Iespējams, ar failu kaut kas nav labi. Mēģināt jaunu failu - refresh."
            }
        };
    }
};

document.getElementById("fileInputButton").addEventListener("click", handleFiles, {once: true});