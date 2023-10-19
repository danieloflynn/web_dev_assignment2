// fetch data from the JSON file
// adding error check function
async function getData() {
    let json;
    try {
    // try block //TODO might need to change the element where error message is displayed?
        let data = await fetch("./senators.json");
        // if not successful:
        if (data.ok){
            json = await data.json(); //assign value don't declare, scoping was causing me heartfailure :) 
        } else if (data.status >= 400 && data.status < 500) {
            // Client-side error
            document.getElementById("div").innerText = "Client-side error: HTTP status code " + data.status;
        } else if (data.status >= 500) {
            // Server-side error
            document.getElementById("div").innerText = "Server-side error: HTTP status code " + data.status;
        } else {
            // Unknown error
            document.getElementById("div").innerText = "Unknown error: HTTP status code " + data.status;
        }
    }
    catch(error){
        document.getElementById("div").innerText = "Error: " + error.message;
    }

    return json;
 

}

// count senators by party
// returns an object with party as key and count as value
function countSenatorsByParty(data) {
    let partyCount = {};

    for (let senator of data.objects) {
        if (!partyCount[senator.party]) {
            partyCount[senator.party] = 0;
        }
        partyCount[senator.party] += 1;
    }
    return partyCount;
}

// This function will make the bar chart on top of the count boxes
function makeBarChart(partyObj) {

    // Get total senators
    let totalSenators = 0;
    for (key in partyObj) {
        totalSenators += partyObj[key];
    }



    // loop that creates boxes for each party and sizes/colours them accordingly
    for (key in partyObj) {
        let el = document.createElement("div");
        el.classList.add("bar");
        el.classList.add(key);
        el.setAttribute("style", "width: " + partyObj[key] * 100 / totalSenators.toString() + "vw")
        document.getElementById("bar-chart").appendChild(el)

    }

}

// Make boxes for the count of senators by party
// Takes object with parties as keys and number of senators as value
function makePartyBoxes(partyObj) {

    for (let key in partyObj) {

        // Make the count box
        let cb = document.createElement("div");
        cb.classList.add("count");
        cb.setAttribute("id", key + "-party");

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
// pulls the following info from data letiable :
// name, party, state, gender, rank, office, DOB, start date, twitter ID, youtube ID, website link

function extractSenatorInfomation(senatorData) {
//make sort by ranking & party 

    let senatorInformationList = [];

    for (let senatorInformation of senatorData) {
        let senator = {
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
    let senators = extractSenatorInfomation(data);
    let senatorListEl = document.getElementById("senators")

    for (let senator of senators) {
        let senatorEl = document.createElement("div", { class: "senator-box" }); //<div class ="senator-box"></div>
        Object.keys(senator).forEach(function (key) {
            let fieldEl = document.createElement("div"); //<div></div>
            fieldEl.innerText = senator[key]; //<div>Tara</div>
            senatorEl.appendChild(fieldEl); //<div class ="senator-box"><div>Tara</div></div>
        })
        senatorListEl.appendChild(senatorEl)
    }

}
// function to create senior senator list 
// need to group by party 

function extractSeniorSenators(seniorData){
    let seniorSenatorList = [];

    for (let seniorSenatorInfo of seniorData){
        // filters the senators that have a leadership title 
        if (seniorSenatorInfo.leadership_title) {
            let seniorSenator = {
                title: seniorSenatorInfo.leadership_title,
                name: seniorSenatorInfo.person.name,
                party: seniorSenatorInfo.party,
            };
            seniorSenatorList.push(seniorSenator);
        }
    }
    return seniorSenatorList;
}

function makeSeniorList(data){
    let seniorSenators = extractSeniorSenators(data);
    let seniorSenatorListEl = document.getElementById("leadership");

    for (let seniorSenator of seniorSenators){
        let seniorSenatorEl = document.createElement("div");
        seniorSenatorEl.className = 'seniorSenator-box';
        Object.keys(seniorSenator).forEach(function (key){
            let fieldEl = document.createElement("div");
            fieldEl.innerText = seniorSenator[key];
            seniorSenatorEl.appendChild(fieldEl);
        })
        seniorSenatorListEl.appendChild(seniorSenatorEl);
    }
}


// Start Filter Creation/Manipulation Functions
// This 


// get all the filter names
// Returns a set object with all party names
// TODO: Change this to take the set from senatorList instead of the raw data
function getFilterNames(data) {

    return {
        "parties": new Set(data["objects"].map(x => x["party"])),
        "states": new Set(data["objects"].map(x => x["state"])),
        "gender": new Set(data["objects"].map(x => x["person"]["gender_label"])),
        "rank": new Set(data["objects"].map(x => x["senator_rank_label"])),
    };
}


// This function will take filters and insert them into each filter category
// Takes in filter object, with names = name of category (state, gender, etc) and values = set of options
function insertFilterOptions(filters) {
    // This function will create each individual filter box
    // Takes name and "All" box element name
    function makeFilterBox(name, grouping) {
        let allBox = document.getElementById(grouping + "-all");
        // create list item
        let el = document.createElement("li");
        el.setAttribute('id', name);
        el.onclick = ()=> {toggleSelection(grouping, name)};
        // create p tag for the text
        let p = document.createElement("p");
        p.innerHTML = name;
        // create p tag for the checkmark
        let pcheck = document.createElement("p");
        pcheck.innerHTML = "&check;";
        pcheck.classList.add("check-mark");
        pcheck.setAttribute("id", name + "-check");
        // insert elements
        allBox.after(el);
        el.appendChild(p);
        p.after(pcheck);
    }


    // Insert options
    // TODO: put the for loop into the makeFilterBox function

    for (let party of filters["parties"]) {
        makeFilterBox(party, "party");
    }

    let statelist = document.getElementById("state-all");
    for (let state of filters["states"]) {
        makeFilterBox(state, "state");
    }

    let genderlist = document.getElementById("gender-all");
    for (let gender of filters["gender"]) {
        makeFilterBox(gender, "gender");
    }

    let ranklist = document.getElementById("rank-all");
    for (let rank of filters["rank"]) {
        makeFilterBox(rank, "rank");
    }


}




// This function toggles the dropdowns for filter boxes
// Takes tagID as string, toggles display on said box
function toggleDropdown(tagID) {
    document.getElementById(tagID).classList.toggle("hide");
}


// This function will run the necessary code for the selectAll
// Will take in grouping as string (either Part, State, or rank)
// Removes all of the filters for that grouping on all senators, unchecks all other boxes in that filter section
function selectAll(grouping) {

}

// This filter will be invoked when an item in the dropdown list is selected/deselected
// function will toggle hide on the corresponding senators, the check mark
// !NOTE: We will need some way of making sure when checking something that it's not unchecked in one of the other 
function toggleSelection(grouping, item) {
    let checkbox = document.getElementById(item+"-check");
    checkbox.classList.toggle("hide");
}


// End Filter Manipulation Functions



// Add event listener allows HTML to be loaded first before JS starts. Best practice
document.addEventListener("DOMContentLoaded", async () => {



    // Pull the data from JSON file
    const data = await getData();
    console.log(data)
    // object with party as key and count as value
    const partyObj = countSenatorsByParty(data);
    // This function will create the bar chart
    makeBarChart(partyObj);
    // Make the boxes with the count per party
    makePartyBoxes(partyObj);
    // filter object with state, party, gender, rank, for insertion into filter boxes
    const filters = getFilterNames(data);
    // Insert filter options
    insertFilterOptions(filters);
    //make senator list
    makeSenatorList(data.objects);
    // make senior senator list
    makeSeniorList(data.objects);


});