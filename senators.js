
// Add event listener allows HTML to be loaded first before JS starts. Best practice
document.addEventListener("DOMContentLoaded", async () => {
    
    
    // fetch data from the JSON file
    async function getData() {
        let data = await fetch("./senators.json");
        let json = await data.json();
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

    // Pull the data from JSON file
    const data = await getData();
    // Names of the different parties
    const parties = getPartyNames(data);
    // object with party as key and count as value
    const partyCount = countSenatorsByParty(data,parties);


});