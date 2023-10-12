
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

    // This function will make the bar chart on top of the count boxes
    function makeBarChart(partyObj) {

        // Get total senators
        let totalSenators = 0;
        for(key in partyObj) {
            totalSenators += partyObj[key];
        }
        
        // loop that creates boxes for each party and sizes/colours them accordingly
        for(key in partyObj) {
            let el = document.createElement("div");
            el.classList.add("bar");
            el.classList.add(key);
            console.log(partyObj[key]*100/totalSenators.toString());
            el.setAttribute("style", "width: " + partyObj[key]*100/totalSenators.toString() + "vw")
            document.getElementById("bar-chart").appendChild(el)

            
        }

    }

    // Make boxes for the count of senators by party
    // Takes object with parties as keys and number of senators as value
    function makePartyBoxes (partyObj) {

        for (let key in partyObj) {

            // Make the count box
            let cb = document.createElement("div");
            cb.classList.add("count");
            cb.setAttribute("id", key+"-party");
            
            // Add the count number
            let cn = document.createElement("h1");
            cn.classList.add("count-number");
            cn.innerHTML = partyObj[key];


            // Add the party name
            let cp = document.createElement("h2");
            cp.classList.add("count-party");
            cp.innerHTML = key;

            // Add the count box to the count box container, insert the count number into count box, add party after count box
            document.getElementById("count-boxes").appendChild(cb).appendChild(cn).after(cp);
            
        }
    }

    // Pull the data from JSON file
    const data = await getData();
    // Names of the different parties
    const parties = getPartyNames(data);
    // object with party as key and count as value
    const partyObj = countSenatorsByParty(data,parties);
    // This function will create the bar chart
    makeBarChart(partyObj);
    // Make the boxes with the count per party
    makePartyBoxes(partyObj);



});