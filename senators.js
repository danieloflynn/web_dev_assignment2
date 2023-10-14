
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
    // TODO: Create bar chart
    function makeBarChart(partyObj) {
        console.log("Need to make bar chart");
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
    // making boxes for each senator for full list
    // pulls the following info from data variable :
        // name, party, state, gender, rank, office, DOB, start date, twitter ID, youtube ID, website link

    function extractSenatorInfomation(senatorData) {

        var senatorInformationList = []; 

        for (let senatorInformation of senatorData) {
            console.log(senatorInformation)
            var senator = {
                name: senatorInformation.person.name,
                party: senatorInformation.party,
                state: senatorInformation.state,
                gender: senatorInformation.person.gender,
                rank: senatorInformation.senator_rank,
                office: senatorInformation.office,
                DOB: senatorInformation.person.birthday,
                startDate: senatorInformation.startdate,
                twitterID: senatorInformation.person.twitterid,
                youtubeID: senatorInformation.person.youtubeid,
                websiteLink: senatorInformation.website,
            };
            senatorInformationList.push(senator)
        }
        return senatorInformationList; 
    }
    
    // function to make senator list
    function makeSenatorList(data) {
        var senators = extractSenatorInfomation(data);
        var senatorListEl = document.getElementById("senators")

        for (let senator of senators) {
            var senatorEl = document.createElement("div", {class: "senator-box"}); //<div class ="senator-box"></div>
            Object.keys(senator).forEach(function(key){
                var fieldEl = document.createElement("div"); //<div></div>
                fieldEl.innerText = senator[key]; //<div>Tara</div>
                senatorEl.appendChild(fieldEl); //<div class ="senator-box"><div>Tara</div></div>
            })
            senatorListEl.appendChild(senatorEl)
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
    //make senator list
    makeSenatorList(data.objects);


});