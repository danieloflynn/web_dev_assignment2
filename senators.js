
// Add event listener allows HTML to be loaded first before JS starts. Best practice
document.addEventListener("DOMContentLoaded", async () => {
    
    
    // fetch data from the JSON file
    async function getData() {
        let data = await fetch("./senators.json");
        let json = data.json();
        return json;

    }

    // get all the party names
    // Returns a set object with all party names
    function getPartyNames(data) {
        return new Set(data["objects"].map(x=>x["party"]));
    }

    // count senators by party
    // returns an object with party as key and count as value
    function countSenatorsByParty(data, parties) {
        let partyCount = {};
        for(let party of parties) {
            partyCount[party] = data["objects"].filter(x=>x["party"] == party).length;
        }
        return partyCount;
    }

    // Make boxes for the count of senators by party
    // Takes object with parties as keys and number of senators as value
    function makePartyBoxes (partyObj) {

        for (let key in partyObj) {
            console.log(key);
            console.log(partyObj[key]);

            let cb = document.createElement("div");
            cb.classList.add("count");
            cb.setAttribute("id", key+"-party");
            
            let cn = document.createElement("h1");
            cn.classList.add("count-number");
            cn.innerHTML = partyObj[key];
            
            let cp = document.createElement("h2");
            cp.classList.add("count-party");
            cp.innerHTML = key;

            document.getElementById("count-boxes").appendChild(cb).appendChild(cn).after(cp);





            
            
        }
    }

    // Pull the data from JSON file
    const data = await getData();
    // Names of the different parties
    const parties = getPartyNames(data);
    // object with party as key and count as value
    const partyCount = countSenatorsByParty(data,parties);
    // Make the boxes with the count per party
    makePartyBoxes(partyCount);



});